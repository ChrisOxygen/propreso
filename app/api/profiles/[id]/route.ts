import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  console.log("Profile ID:----------------------", id);

  try {
    // Validate ID
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { message: "Valid profile ID is required" },
        { status: 400 }
      );
    }

    // Fetch the profile from the database
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: { projects: true },
    });

    // Check if profile exists
    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    // Return the profile
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
