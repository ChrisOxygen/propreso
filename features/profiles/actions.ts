"use server";

import { generateWithOpenAI } from "@/lib/actions";
import { CreateProfileState } from "./context/CreateProfileContext";
import { auth } from "@/auth";
import { PrismaClient, Profile, Project } from "@prisma/client";
import { ProjectFormValues } from "./schemas/projectSchema";

const prisma = new PrismaClient();

export interface generateBioWithAIParams {
  jobTitle: string;
  skills: string[];
  name: string;
}

export const generateBioWithAI = async ({
  jobTitle,
  skills,
  name: userName,
}: generateBioWithAIParams) => {
  try {
    if (!jobTitle || !skills || skills.length === 0 || !userName) {
      const err = new Error("Missing required fields");

      throw err;
    }

    // Create prompt for OpenAI
    const prompt = `Generate a concise and compelling professional bio for ${userName} 
        who is a ${jobTitle}. They are skilled in ${skills.join(", ")}. 
        The bio should be written in first person, be approximately 150-200 words, 
        highlight their expertise, and sound friendly yet professional. 
        Do not use placeholders or generic statements.`;

    const generatedBio = await generateWithOpenAI({
      prompt,
    });

    console.log("generatedBio-----------", generatedBio);

    // Extract the generated bio
    // const generatedBio = completion.choices[0].message.content?.trim() || "";

    return { bio: generatedBio } as { bio: string };

    // const data = await response.json();
    // setBioText(data.bio);
    // setBio(data.bio); // Save generated bio to state

    // // Trigger bio analysis after generation
    // if (progressRef?.current) {
    //   progressRef.current.handleBioFocus();
    // }
  } catch (error) {
    console.error("Error generating bio:", error);
    // Show error message to user
  }
};

export interface RefineBioParams {
  bioText: string;
  jobTitle: string;
  skills: string[];
}

// Refine existing bio with OpenAI
export const refineBioWithAI = async ({
  bioText,
  jobTitle,
  skills,
}: RefineBioParams) => {
  if (!bioText.trim()) {
    return; // Don't refine empty bio
  }

  try {
    if (!bioText || !jobTitle) {
      throw new Error("Missing required fields");
    }

    // Create prompt for OpenAI
    const prompt = `Refine the following professional bio for a ${jobTitle} with the following skills ${skills.join(
      ", "
    )}:
        
        "${bioText}"
        
        Please improve this bio by:
        1. Making it more concise and compelling
        2. Highlighting key skills more effectively
        3. Improving overall professionalism while keeping a friendly tone
        4. Keeping it in first person
        5. Ensuring it's around 150-200 words
        
        Return only the refined bio text without additional commentary.`;

    // Extract the refined bio
    const refinedBio = await generateWithOpenAI({
      prompt,
    });

    return { refinedBio } as { refinedBio: string };

    // const data = await response.json();
    // setBioText(data.refinedBio);
    // setBio(data.refinedBio); // Save refined bio to state
  } catch (error) {
    console.error("Error refining bio:", error);
    // Show error message to user
    throw new Error("Failed to refine bio");
  }
};

// create profile

export const createProfile = async (state: CreateProfileState) => {
  const { userInformation } = state;

  try {
    // Get the current user from auth
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const { jobTitle, skills, bio, isDefaultProfile } = userInformation;

    // Validate required fields
    if (!jobTitle || !skills?.length || !bio) {
      throw new Error("Missing required fields");
    }

    // Check if user already has 3 profiles and is trying to create a new one
    const existingProfilesCount = await prisma.profile.count({
      where: { userId },
    });

    if (existingProfilesCount >= 3) {
      throw new Error(
        "Maximum number of profiles (3) reached. Please delete an existing profile to create a new one."
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

      //check profile strength

      const profileStrengthData = await checkProfileStrength({
        bio,
        skills,
        projects: [], // Pass an empty array for now
      });

      // Create new profile
      const newProfile = await tx.profile.create({
        data: {
          jobTitle,
          bio,
          skills,
          isDefault: isDefaultProfile ?? false,
          userId,
          profileStength: profileStrengthData.profileStrength,
          profileStengthMessage: JSON.stringify(
            profileStrengthData.profileSuggestions
          ),
        },
      });

      // Check if the profile was created successfully
      if (!newProfile) {
        throw new Error("Failed to create profile");
      }

      // Create projects for the profile
      // for (const project of projects) {
      //   await tx.project.create({
      //     data: {
      //       title: project.title,
      //       description: project.description,
      //       liveLink: project.liveLink || null,
      //       githubLink: project.githubLink || null,
      //       profileId: profile.id,
      //     },
      //   });
      // }

      // Update the user's hasCreatedProfile flag if this is their first profile
      await tx.user.update({
        where: { id: userId },
        data: { hasCreatedProfile: true },
      });
      console.log(
        "Profile created successfully:---------------------",
        newProfile
      );

      return newProfile;
    });

    console.log("result:---------------------", result);

    return {
      message: "Profile created successfully",
      profile: result,
    };
  } catch (error) {
    console.error("Profile operation error:", error);
    throw new Error("Failed to create profile");
  } finally {
    await prisma.$disconnect();
  }
};

export const getUserProfiles = async (userId: string) => {
  try {
    // Validate required fields
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Find all profiles associated with the user ID
    const userProfiles = await prisma.profile.findMany({
      where: { userId: userId },
      include: {
        projects: true, // Include related projects for each profile
      },
      orderBy: {
        createdAt: "desc", // Get newest profiles first
      },
    });

    // Return the profiles even if the array is empty
    // This allows the client to know the user has no profiles yet
    return userProfiles;
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    throw new Error("Failed to fetch user profiles");
  } finally {
    await prisma.$disconnect();
  }
};

export const getProfileById = async (profileId: string) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        projects: true, // Include related projects
      },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  } finally {
    await prisma.$disconnect();
  }
};

export async function addNewProject(
  profileId: string,
  projectData: ProjectFormValues
) {
  console.log("addNewProject:---------------------", {
    profileId,
    projectData,
  });
  try {
    // Validate required fields
    if (!profileId || !projectData) {
      throw new Error("Missing required fields");
    }

    // analyze project strength
    const projectStrengthData = await analyzeProjectStrength(projectData);

    if (!projectStrengthData) {
      throw new Error("Failed to analyze project strength");
    }

    // Create new project in the database
    const newProject = await prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description,
        liveLink: projectData.liveLink || null,
        repoLink: projectData.repoLink || null,
        projectStrength: projectStrengthData.projectStrength,
        projectStrengthMessage: JSON.stringify(
          projectStrengthData.projectsStrengthMessage
        ),
        profileId,
      },
    });

    if (!newProject) {
      throw new Error("Failed to create new project");
    }

    // analyze profile with AI
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        projects: true, // Include related projects
      },
    });
    if (!profile) {
      throw new Error("Profile not found");
    }
    const profileStrengthData = await checkProfileStrength({
      bio: profile.bio,
      skills: profile.skills,
      projects: profile.projects, // Include the new project
    });
    if (!profileStrengthData) {
      throw new Error("Failed to analyze profile strength");
    }
    // Update the profile with the new project and its strength
    await prisma.profile.update({
      where: { id: profileId },
      data: {
        profileStength: profileStrengthData.profileStrength,
        profileStengthMessage: JSON.stringify(
          profileStrengthData.profileSuggestions
        ),
      },
    });

    return {
      message: "Project added successfully",
      project: newProject,
    };
  } catch (error) {
    console.error("Error adding new project:", error);
    throw new Error("Failed to add new project");
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateProject(
  projectId: string,
  projectData: ProjectFormValues
) {
  console.log("updateProject:---------------------", {
    projectId,
    projectData,
  });
  try {
    // Validate required fields
    if (!projectId || !projectData) {
      throw new Error("Missing required fields");
    }

    // Fetch the existing project to make sure it exists
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      throw new Error("Project not found");
    }

    // analyze project strength with updated data
    const projectStrengthData = await analyzeProjectStrength(projectData);

    if (!projectStrengthData) {
      throw new Error("Failed to analyze project strength");
    }

    // Update the project in the database
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: projectData.title,
        description: projectData.description,
        liveLink: projectData.liveLink || null,
        repoLink: projectData.repoLink || null,
        projectStrength: projectStrengthData.projectStrength,
        projectStrengthMessage: JSON.stringify(
          projectStrengthData.projectsStrengthMessage
        ),
      },
    });

    if (!updatedProject) {
      throw new Error("Failed to update project");
    }

    // Get the profile ID from the project
    const profileId = existingProject.profileId;

    // Fetch the profile with all its projects to update profile strength
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        projects: true, // Include all projects
      },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Re-analyze profile strength with updated project data
    const profileStrengthData = await checkProfileStrength({
      bio: profile.bio,
      skills: profile.skills,
      projects: profile.projects, // All projects, including the updated one
    });

    if (!profileStrengthData) {
      throw new Error("Failed to analyze profile strength");
    }

    // Update the profile with the new strength analysis
    await prisma.profile.update({
      where: { id: profileId },
      data: {
        profileStength: profileStrengthData.profileStrength,
        profileStengthMessage: JSON.stringify(
          profileStrengthData.profileSuggestions
        ),
      },
    });

    return {
      message: "Project updated successfully",
      project: updatedProject,
    };
  } catch (error) {
    console.error("Error updating project:", error);
    const theError = error as Error;
    throw new Error(`Failed to update project: ${theError.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

export interface ProfileSuggestions {
  bio: {
    message: string;
  };
  skills: {
    message: string;
  };
  projects: {
    message: string;
  };
}

interface ProfileStrengthResult {
  profileStrength: number;
  profileSuggestions: ProfileSuggestions;
}

export async function checkProfileStrength(profileInfoToAnalye: {
  bio: string;
  skills: string[];
  projects?: Project[];
}): Promise<ProfileStrengthResult> {
  // Ensure profile has all required fields with default values
  const safeProfile = {
    bio: profileInfoToAnalye.bio || "",
    skills: profileInfoToAnalye.skills || [],
    projects: profileInfoToAnalye.projects || [],
  };

  // Initialize score
  let totalScore = 0;

  // Initialize suggestions
  const suggestions: ProfileSuggestions = {
    bio: { message: "" },
    skills: { message: "" },
    projects: { message: "" },
  };

  // 1. Bio Score
  const bioWordCount = safeProfile.bio
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  let bioScore = 0;

  if (bioWordCount >= 100 && bioWordCount <= 200) {
    bioScore = 40;
    suggestions.bio.message = "good";
  } else if (
    (bioWordCount >= 50 && bioWordCount < 100) ||
    (bioWordCount > 200 && bioWordCount <= 300)
  ) {
    bioScore = 35;
    suggestions.bio.message =
      bioWordCount < 100
        ? "Your bio is a bit short. Try expanding it to 100-200 words for optimal impact."
        : "Your bio is a bit long. Consider trimming it to 100-200 words for optimal impact.";
  } else {
    bioScore = 20;
    suggestions.bio.message =
      bioWordCount < 50
        ? "Your bio is too short. Aim for 100-200 words to effectively showcase yourself."
        : "Your bio is too long. Reduce it to 100-200 words to keep readers engaged.";
  }

  totalScore += bioScore;

  // 2. Skills Score
  const skillsCount = safeProfile.skills.length;
  const getSkillsScore = (count: number) => {
    if (count >= 8) return 20;
    const countPercentage = (count / 8) * 100;
    const score = (countPercentage / 100) * 20; // Scale to 20 points

    return Math.round(score);
  };

  const skillsScore = getSkillsScore(skillsCount);

  suggestions.skills.message =
    skillsCount >= 8
      ? "good"
      : `You currently have ${skillsCount} skill${
          skillsCount === 1 ? "" : "s"
        } listed. Add at least ${8 - skillsCount} more skill${
          8 - skillsCount === 1 ? "" : "s"
        } to maximize your profile strength.`;

  totalScore += skillsScore;

  // 3. Projects Score
  const projectsCount = safeProfile.projects.length;
  const projectsScore = Math.min(projectsCount * 10, 40); // 10 points per project, max 40

  if (projectsCount >= 4) {
    suggestions.projects.message = "good";
  } else {
    suggestions.projects.message = `You currently have ${projectsCount} project${
      projectsCount === 1 ? "" : "s"
    }. Add ${4 - projectsCount} more project${
      4 - projectsCount === 1 ? "" : "s"
    } to strengthen your profile.`;
  }

  // Check project strengths
  if (projectsCount > 0) {
    const lowStrengthProjects = safeProfile.projects.filter(
      (p) => typeof p.projectStrength === "number" && p.projectStrength < 70
    );

    if (lowStrengthProjects.length > 0) {
      if (projectsCount === 4) {
        suggestions.projects.message = ` Consider improving the details for ${
          lowStrengthProjects.length === 1
            ? "one of your projects that has a"
            : `${lowStrengthProjects.length} of your projects that have`
        } lower strength score${lowStrengthProjects.length === 1 ? "" : "s"}.`;
      } else {
        suggestions.projects.message += `Also, consider enhancing the details of ${
          lowStrengthProjects.length === 1
            ? "one of your existing projects that has a"
            : `${lowStrengthProjects.length} of your existing projects that have`
        } lower strength score${lowStrengthProjects.length === 1 ? "" : "s"}.`;
      }
    }
  }

  totalScore += projectsScore;

  return {
    profileStrength: totalScore,
    profileSuggestions: suggestions,
  };
}

interface UpdateProfileData {
  profileId: string;
  bio?: string;
  skills?: string[]; // This is a direct String[] on the Profile model
}

/**
 * Server action to update a user's profile based on the Profile model
 * Requires authentication and proper authorization
 * @param params Object containing profileId and optional fields to update
 * @returns Response object with success status and updated profile data
 */
export async function updateUserProfile(data: UpdateProfileData) {
  const { profileId, bio, skills } = data;

  if (!profileId) {
    throw new Error("Profile ID not found");
  }

  try {
    // Check for valid session
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    // Get the current user's ID from the session
    const userId = session.user.id;

    // Check if the profile exists and belongs to the current user
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        projects: true,
      },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Verify the user has permission to update this profile
    if (profile.userId !== userId) {
      throw new Error("Unauthorized to update this profile");
    }

    // check profile strength
    const profileStrengthData = await checkProfileStrength({
      bio: bio || profile.bio,
      skills: skills || profile.skills,
      projects: profile.projects,
    });

    // Prepare the update data object with only provided fields
    const updateData: Partial<Profile> = {};
    const updatedFields: string[] = [];

    if (bio !== undefined) {
      updateData.bio = bio;
      updatedFields.push("bio");
    }

    if (skills !== undefined) {
      updateData.skills = skills;
      updatedFields.push("skills");
    }

    if (profileStrengthData) {
      updateData.profileStength = profileStrengthData.profileStrength;
      updateData.profileStengthMessage = JSON.stringify(
        profileStrengthData.profileSuggestions
      );
      updatedFields.push("profileStength", "profileStengthMessage");
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields to update");
    }

    // Update the profile with all provided fields
    // The skills array is directly on the Profile model
    const updatedProfile = await prisma.profile.update({
      where: { id: profileId },
      data: updateData,
      include: { projects: true }, // Include related projects if needed
    });

    if (!updatedProfile) {
      throw new Error("Failed to update profile");
    }

    return {
      success: true,
      message: "Profile updated successfully",
      updatedFields,
      profile: updatedProfile,
    };
  } catch (error) {
    console.error("Error updating profile:", error);

    throw new Error(
      error instanceof Error ? error.message : "Failed to update profile"
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function generateProjectDescWithAI(
  projectData: ProjectFormValues
) {
  try {
    if (!projectData) {
      throw new Error("Project data is required");
    }

    // Create prompt for OpenAI
    const prompt = `Generate a detailed project description based on the following information:
        - Project Title: "${projectData.title || ""}" 
        - Project Description: "${projectData.description || ""}"
        - Live Link: "${projectData.liveLink || ""}"
        - GitHub Link: "${projectData.repoLink || ""}"

        The description should include:
        1. Overview of the project
        2. Technologies used
        3. Key features
        4. Challenges faced and how they were overcome
        
        Ensure the description is clear, concise, and engaging. lets it not be more  that 80 words. Use friendly language approprate for a novice audience.

        Return only the project description text without additional commentary.
        
        if the Project title doesn't make sense, return the text: "i do not understand the projects title"`;

    const generatedDescription = await generateWithOpenAI({
      prompt,
    });

    // Extract the generated description

    console.log("generatedDescription-----------", generatedDescription);

    return { description: generatedDescription } as { description: string };
  } catch (error) {
    console.error("Error generating project description:", error);
    // Show error message to user
    throw new Error("Failed to generate project description");
  }
}

interface ProjectStrengthMessage {
  titleMsg: string;
  descMsg: string;
  links: string;
}

interface ProjectStrengthResult {
  projectStrength: number; // Keeping this spelling as per requirements
  projectsStrengthMessage: ProjectStrengthMessage; // Keeping this spelling as per requirements
}

export async function analyzeProjectStrength(
  project: ProjectFormValues
): Promise<ProjectStrengthResult> {
  // Ensure project has all required fields with default values
  const safeProject = {
    title: project.title || "",
    description: project.description || "",
    liveLink: project.liveLink || null,
    repoLink: project.repoLink || null,
  };

  // Initialize score and messages
  let totalScore = 0;
  const strengthMessage: ProjectStrengthMessage = {
    titleMsg: "",
    descMsg: "",
    links: "",
  };

  // 1. Title Score (20 points)
  let titleScore = 0;
  const titleLength = safeProject.title.trim().length;
  const hasPurposeInTitle =
    /project|app|system|tool|website|platform|dashboard|portfolio|game|api/i.test(
      safeProject.title
    );

  if (titleLength > 3 && hasPurposeInTitle) {
    titleScore = 20;
    strengthMessage.titleMsg = "good";
  } else if (titleLength > 3) {
    titleScore = 10;
    strengthMessage.titleMsg = "Add project type/purpose to your title";
  } else {
    titleScore = 0;
    strengthMessage.titleMsg = "title is too poor";
  }

  totalScore += titleScore;

  // 2. Links Score (30 points)
  let linksScore = 0;

  if (safeProject.liveLink || safeProject.repoLink) {
    linksScore = 30;
    strengthMessage.links = "good";
  } else {
    linksScore = 0;
    strengthMessage.links = "add a link";
  }

  totalScore += linksScore;

  // 3. Description Score (50 points)
  let descScore = 0;
  const descWordCount = safeProject.description
    .trim()
    .split(/\s+/)
    .filter((word: string) => word.length > 0).length;

  if (descWordCount >= 70 && descWordCount <= 100) {
    descScore = 50;
    strengthMessage.descMsg = "good";
  } else if (
    (descWordCount >= 60 && descWordCount < 70) ||
    (descWordCount > 100 && descWordCount <= 130)
  ) {
    descScore = 30;
    strengthMessage.descMsg =
      descWordCount < 70
        ? "slightly short, aim for 70-100 words"
        : "slightly long, aim for 70-100 words";
  } else if (
    (descWordCount >= 50 && descWordCount < 60) ||
    (descWordCount > 130 && descWordCount <= 300)
  ) {
    descScore = 20;
    strengthMessage.descMsg =
      descWordCount < 60
        ? "quite short, add more details to reach 70-100 words"
        : "quite long, try to reduce to 70-100 words";
  } else {
    descScore = 10;
    strengthMessage.descMsg =
      descWordCount < 50
        ? "too short, significantly expand your description to 70-100 words"
        : "too long, significantly reduce your description to 70-100 words";
  }

  totalScore += descScore;

  return {
    projectStrength: totalScore,
    projectsStrengthMessage: strengthMessage,
  };
}

/**
 * Sets a profile as the default profile for a user
 *
 * @param profileId - The ID of the profile to set as default
 */
export async function setDefaultProfile(profileId: string) {
  try {
    // Get the current session to verify user
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id as string;

    // Find the profile and verify it belongs to the current user
    const profile = await prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    if (profile.userId !== userId) {
      throw new Error("Unauthorized to set this profile as default");
    }

    // Set all profiles for this user to not default (transaction)
    await prisma.$transaction([
      // First, unset default for all user profiles
      prisma.profile.updateMany({
        where: {
          userId: userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      }),

      // Then, set the specified profile as default
      prisma.profile.update({
        where: {
          id: profileId,
        },
        data: {
          isDefault: true,
        },
      }),
    ]);

    return {
      success: true,
      message: "Profile has been set as default successfully.",
    };
  } catch (error) {
    console.error("Error setting default profile:", error);

    throw new Error(
      error instanceof Error ? error.message : "Failed to set default profile"
    );
  }
}
