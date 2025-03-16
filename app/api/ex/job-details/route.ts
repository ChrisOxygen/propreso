// File: app/api/job-details/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { parseJobUrl } from "@/lib/services";

// Initialize Prisma client
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
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

    // Parse request body
    const jobDetails = await req.json();

    if (!jobDetails || !jobDetails.url || !jobDetails.html) {
      return NextResponse.json(
        { error: "Invalid job details provided" },
        { status: 400 }
      );
    }

    const { platform, jobId } = parseJobUrl(jobDetails.url);

    if (!platform || !jobId) {
      return NextResponse.json(
        { error: "Invalid job URL provided" },
        { status: 400 }
      );
    }

    // Check if user already has a job details entry
    const existingJobDetail = await prisma.jobDetail.findFirst({
      where: { userId },
    });

    // If exists, delete it
    if (existingJobDetail) {
      await prisma.jobDetail.delete({
        where: { id: existingJobDetail.id },
      });
    }

    // Create new job details
    const newJobDetails = await prisma.jobDetail.create({
      data: {
        userId,
        jobUrl: jobDetails.url,
        jobHtml: jobDetails.html,
        platform,
        platformJobId: jobId,
        timestamp: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job details saved successfully",
      jobDetailsId: newJobDetails.id,
    });
  } catch (error) {
    console.error("Error handling job details:", error);
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

export async function GET() {
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

    const jobDetail = await prisma.jobDetail.findUnique({
      where: { userId },
    });
    if (!jobDetail) {
      return NextResponse.json(
        { success: false, message: "No job details found for this user" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      jobDetails: {
        id: jobDetail.id,
        jobUrl: jobDetail.jobUrl,
        jobHtml: jobDetail.jobHtml,
        timestamp: jobDetail.timestamp,
      },
    });
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
