import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in" },
        { status: 401 }
      );
    }

    // Get user ID from session
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid session: User ID not found" },
        { status: 400 }
      );
    }

    // Get job ID from route params
    const { id: jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Get the specific job detail by ID and verify it belongs to the user
    const jobDetail = await prisma.jobDetail.findUnique({
      where: {
        id: jobId,
        userId: userId, // Ensure the job belongs to the authenticated user
      },
    });

    if (!jobDetail) {
      return NextResponse.json(
        {
          success: false,
          message: "Job detail not found or doesn't belong to this user",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(jobDetail);
  } catch (error) {
    console.error("Error retrieving job details:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
