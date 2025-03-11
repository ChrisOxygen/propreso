// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get the current user from auth
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse the request body
    const { jobTitle, skills, bio, projects, isDefaultProfile } =
      (await request.json()) as userProfileData;

    // Validate required fields
    if (!jobTitle || !skills?.length || !bio || !projects?.length) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already has 3 profiles and is trying to create a new one
    const existingProfilesCount = await prisma.profile.count({
      where: { userId },
    });

    if (existingProfilesCount >= 3) {
      return NextResponse.json(
        { message: "Maximum number of profiles (3) reached" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // If isDefault is true, unset any existing default profiles
      if (isDefaultProfile) {
        await tx.profile.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // Create new profile
      const profile = await tx.profile.create({
        data: {
          jobTitle,
          bio,
          skills,
          isDefault: isDefaultProfile ?? false,
          userId,
        },
      });

      // Create projects for the profile
      for (const project of projects) {
        await tx.project.create({
          data: {
            title: project.title,
            description: project.description,
            liveLink: project.liveLink || null,
            githubLink: project.githubLink || null,
            profileId: profile.id,
          },
        });
      }

      // Update the user's hasCreatedProfile flag if this is their first profile
      await tx.user.update({
        where: { id: userId },
        data: { hasCreatedProfile: true },
      });
    });

    return NextResponse.json(
      {
        message: "Profile created successfully",
        profile: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile operation error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Get all profiles for the current user
export async function GET() {
  try {
    // Get the current user from auth
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get all profiles with their projects
    const profiles = await prisma.profile.findMany({
      where: { userId },
      include: { projects: true },
      orderBy: [
        { isDefault: "desc" }, // Default profile first
        { updatedAt: "desc" }, // Then by recently updated
      ],
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
