// lib/actions/generateProposal.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { generateWithOpenAI } from "@/lib/actions";

// Initialize Prisma client
const prisma = new PrismaClient();

export type GenerateProposalWithAIParams = {
  jobDescription: string;
  formula?: "aida" | "pas" | "bab" | "star" | "fab";
  tone?: "professional" | "friendly";
  jobTitle: string;
  addPortfolioSamples: boolean;
};

export async function generateProposalWithAI({
  jobDescription,
  formula = "aida",
  tone = "professional",
  addPortfolioSamples = true,
}: GenerateProposalWithAIParams) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized: You must be logged in");
    }

    // Get user ID from session
    const userId = session.user.id;

    // Validate input
    if (!jobDescription || jobDescription.trim().length < 10) {
      throw new Error(
        "Job description is required and must be at least 10 characters"
      );
    }

    // Get user's default profile for personalization
    const userProfile = await prisma.profile.findFirst({
      where: {
        userId: userId,
        isDefault: true,
      },
      include: {
        projects: {
          orderBy: {
            projectStrength: "desc",
          },
        },
        user: true,
      },
    });

    if (!userProfile) {
      throw new Error("No profile found. Please create a profile first.");
    }

    // Select the prompt based on the formula
    let formulaGuidelines = "";
    switch (formula) {
      case "aida":
        formulaGuidelines = `
          Apply the AIDA formula:
          - Attention: Hook the client with a compelling opening that shows you understand their needs
          - Interest: Highlight your relevant skills and experience
          - Desire: Explain specifically how you can solve their problem and deliver results
          - Action: End with a clear call to action`;
        break;
      case "pas":
        formulaGuidelines = `
          Apply the PAS formula:
          - Problem: Demonstrate deep understanding of their specific issue
          - Agitate: Highlight implications if the problem persists or worsens
          - Solution: Present your approach and resolution path`;
        break;
      case "bab":
        formulaGuidelines = `
          Apply the BAB formula:
          - Before: Acknowledge their current situation and needs
          - After: Paint a picture of the improved future state
          - Bridge: Explain how you'll get them from before to after`;
        break;
      case "star":
        formulaGuidelines = `
          Apply the STAR formula:
          - Situation: Acknowledge their specific project context
          - Task: Clearly state what needs to be accomplished
          - Action: Outline your process to complete it
          - Result: Emphasize the outcomes and benefits`;
        break;
      case "fab":
        formulaGuidelines = `
          Apply the FAB formula:
          - Feature: Highlight your specialized expertise and technical skills
          - Advantage: Explain why your approach/methodology is superior
          - Benefit: Translate technical capabilities into business outcomes`;
        break;
      default:
        formulaGuidelines = `
          Apply the AIDA formula:
          - Attention: Hook the client with a compelling opening that shows you understand their needs
          - Interest: Highlight your relevant skills and experience
          - Desire: Explain specifically how you can solve their problem and deliver results
          - Action: End with a clear call to action`;
    }

    // Select tone guidelines
    const toneGuidelines =
      tone === "professional"
        ? "Use a professional tone that is clear, straightforward, and business-appropriate."
        : "Use a friendly tone that is warm, approachable, and conversational while maintaining professionalism.";

    // Prepare portfolio samples section
    let portfolioSamplesSection = "";
    if (addPortfolioSamples && userProfile.projects.length > 0) {
      // Get top 3 projects by strength
      const topProjects = userProfile.projects.slice(0, 3);

      portfolioSamplesSection = `
  Here are some of my recent projects:
  
  ${topProjects
    .map((project, index) => {
      let projectEntry = `${index + 1}. **${project.title}**`;

      const links = [];
      if (project.liveLink) {
        links.push(`[View Live](${project.liveLink})`);
      }

      if (project.repoLink) {
        links.push(`[View Code](${project.repoLink})`);
      }

      if (links.length > 0) {
        projectEntry += ` - ${links.join(" | ")}`;
      }

      return projectEntry;
    })
    .join("\n")}
  `;
    }

    // Build the prompt for the AI
    const prompt = `
  You are an expert proposal writer for freelancers. First, analyze the job description to determine the best approach for this specific opportunity.
  
  You'll be creating a proposal using the ${formula.toUpperCase()} formula as explicitly selected by the user.
  
  ${formulaGuidelines}
  
  ${toneGuidelines}
  
  Then, create a compelling proposal based on the following job description:
  
  "${jobDescription}"
  
  Use the following personal information for the freelancer:
  
  - Name: ${userProfile.user.fullName}
  - Job title: ${userProfile.jobTitle}
  - Skills: ${userProfile.skills.join(", ")}
  - Bio: ${userProfile.bio}
  
  ${portfolioSamplesSection}
  
  If the job post doesn't include a specific name to address the proposal to:
  
  1. Use one of these professional openings:
  
     - "Hello [Company Name] Team,"
     - "Dear Hiring Manager,"
     - "Hello there,"
     - "Greetings,"
  
  2. Avoid outdated or overly formal salutations like:
  
     - "To Whom It May Concern"
     - "Dear Sir/Madam"
     - "Dear Hiring Committee"
  
  3. If the company name is visible in the job posting, prioritize using "Hello [Company Name] Team," as this shows you've paid attention to the posting details.
  
  4. If the job is posted by an agency or the company name isn't clear, "Hello there," or "Greetings," creates a friendly, professional tone without being overly formal.
  
  5. After your greeting, immediately demonstrate knowledge of their specific project to show personalization despite the lack of a name.
  
  Universal requirements for the proposal:
  
  1. First, analyze the job description to clearly identify what the client explicitly wants AND what they likely need (even if not directly stated)
  
  2. The proposal MUST include:
  
     - Clear identification of the client's stated needs and underlying requirements
     - Front-loaded value (your most impressive relevant result in the first paragraph)
     - Quantified outcomes using specific numbers and percentages whenever possible
     - Relevant suggestions or improvements to the client's project if appropriate
     - Genuine praise for the client's project (be specific, not generic)
     - Preemptive addressing of 1-2 likely concerns
     - An invitation for a 15-minute call to discuss possibilities with no strings attached
     - A brief paragraph mentioning a relevant project you've worked on
  
  3. Use "you" more than "I" and frame capabilities in terms of client benefits.
  4. Keep the proposal between 250-350 words, emphasizing quality over quantity.
  5. Make sure it reads like it was written by a real person, not AI-generated.
  6. Write the proposal in first person as if you are the freelancer.
  7. Use active voice, vary sentence structure, and avoid generic phrases and clichés.
  ${
    addPortfolioSamples
      ? `8. If my portfolio includes relevant projects, mention one that directly relates to this client's needs.`
      : ""
  }
  9. Include the exact portfolio samples section format as provided with no modifications.
  `;

    // Call OpenAI API through the helper function
    const generatedProposal = await generateWithOpenAI({
      prompt,
      max_tokens: 1000,
    });

    // Return the generated proposal
    return { proposal: generatedProposal };
  } catch (error) {
    // Handle errors appropriately for server actions
    console.error("Error generating proposal:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate proposal"
    );
  }
}

export type GenerateJobTitleParams = {
  jobDescription: string;
  maxLength?: number;
};

/**
 * Server function that generates a concise job title based on the provided job description
 * @param jobDescription The full job posting description
 * @param maxLength Maximum length of the generated title (default: 60 characters)
 * @returns An object containing either the generated title or an error message
 */
export async function generateJobTitle({
  jobDescription,
  maxLength = 60,
}: GenerateJobTitleParams) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized: You must be logged in");
    }

    // Validate input
    if (!jobDescription || jobDescription.trim().length < 10) {
      throw new Error(
        "Job description is required and must be at least 10 characters"
      );
    }

    // Build the prompt for the AI
    const prompt = `
  You are an expert at creating clear, concise, and effective job titles.
  
  Analyze the following job description and generate a short, professional job title 
  that accurately reflects the role and would be attractive to qualified candidates.
  
  The title should:
  - Be no more than ${maxLength} characters (including spaces)
  - Be specific about the role (avoid vague titles like "Developer" or "Designer")
  - Include the seniority level if clearly indicated in the description
  - Use industry-standard terminology
  - Be appealing and professional
  - NOT include company names or specific location information
  - NOT use buzzwords like "ninja," "guru," "rockstar," etc.
  
  Job Description:
  """
  ${jobDescription}
  """
  
  Return only the job title with no additional explanation or commentary.
  `;

    // Call OpenAI API through the helper function
    const generatedTitle = await generateWithOpenAI({
      prompt,
      max_tokens: 60, // Short response for a title
      temperature: 0.7, // Slightly creative but still focused
    });

    // Clean up the generated title (remove quotes, newlines, etc.)
    const cleanTitle = generatedTitle
      .replace(/^["'\s]+|["'\s]+$/g, "") // Remove quotes and whitespace at beginning/end
      .replace(/\n/g, "") // Remove any newlines
      .trim();

    // Return the generated job title
    return { title: cleanTitle as string };
  } catch (error) {
    console.error("Error generating job title:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate job title"
    );
  }
}

type SaveProposalParams = {
  title: string;
  jobDescription: string;
  proposal: string;
  amount?: number;
};

/**
 * Creates a new proposal for the authenticated user
 */
export async function createProposal({
  title,
  jobDescription,
  proposal,
  amount,
}: SaveProposalParams) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized: You must be logged in to save a proposal");
    }

    // Get user ID from session
    const userId = session.user.id;

    // Validate inputs
    if (!title || title.trim().length < 3) {
      throw new Error("Title is required and must be at least 3 characters");
    }

    if (!jobDescription || jobDescription.trim().length < 10) {
      throw new Error(
        "Job description is required and must be at least 10 characters"
      );
    }

    if (!proposal || proposal.trim().length < 10) {
      throw new Error(
        "Proposal content is required and must be at least 10 characters"
      );
    }

    // Create new proposal
    const newProposal = await prisma.proposal.create({
      data: {
        title,
        jobDescription,
        proposal,
        amount: amount || 0,
        status: "draft",
        userId,
      },
    });

    // Revalidate the proposals page to reflect changes

    return {
      success: true,
      message: "Proposal saved successfully",
      proposal: newProposal,
    };
  } catch (error) {
    console.error("Error saving proposal:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to save proposal",
    };
  }
}

/**
 * Updates an existing proposal
 */
export async function updateProposal({
  id,
  title,
  jobDescription,
  proposal,
  status,
  amount,
}: SaveProposalParams & { id: string; status?: string }) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error(
        "Unauthorized: You must be logged in to update a proposal"
      );
    }

    // Get user ID from session
    const userId = session.user.id;

    // Check if proposal exists and belongs to the user
    const existingProposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!existingProposal) {
      throw new Error("Proposal not found");
    }

    if (existingProposal.userId !== userId) {
      throw new Error("Unauthorized: You can only update your own proposals");
    }

    // Prepare update data with only the provided fields
    const updateData: Partial<{
      title: string;
      jobDescription: string;
      proposal: string;
      status: string;
      amount: number;
    }> = {};

    if (title !== undefined && title.trim().length >= 3) {
      updateData.title = title;
    }

    if (jobDescription !== undefined && jobDescription.trim().length >= 10) {
      updateData.jobDescription = jobDescription;
    }

    if (proposal !== undefined && proposal.trim().length >= 10) {
      updateData.proposal = proposal;
    }

    if (
      status !== undefined &&
      ["draft", "sent", "opened", "communication", "won", "lost"].includes(
        status
      )
    ) {
      updateData.status = status;
    }

    if (amount !== undefined) {
      updateData.amount = amount;
    }

    // Update proposal
    const updatedProposal = await prisma.proposal.update({
      where: { id },
      data: updateData,
    });

    // Revalidate the proposals page to reflect changes

    return {
      success: true,
      message: "Proposal updated successfully",
      proposal: updatedProposal,
    };
  } catch (error) {
    console.error("Error updating proposal:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update proposal",
    };
  }
}

/**
 * Updates the status of a proposal
 */
export async function updateProposalStatus({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error(
        "Unauthorized: You must be logged in to update a proposal status"
      );
    }

    // Get user ID from session
    const userId = session.user.id;

    // Check if proposal exists and belongs to the user
    const existingProposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!existingProposal) {
      throw new Error("Proposal not found");
    }

    if (existingProposal.userId !== userId) {
      throw new Error("Unauthorized: You can only update your own proposals");
    }

    // Validate status
    if (
      !["draft", "sent", "opened", "communication", "won", "lost"].includes(
        status
      )
    ) {
      throw new Error(
        "Invalid status. Must be one of: draft, sent, opened, communication, won, lost"
      );
    }

    // Update proposal status
    const updatedProposal = await prisma.proposal.update({
      where: { id },
      data: { status },
    });

    // Revalidate the proposals page to reflect changes

    return {
      success: true,
      message: "Proposal status updated successfully",
      proposal: updatedProposal,
    };
  } catch (error) {
    console.error("Error updating proposal status:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update proposal status",
    };
  }
}

/**
 * Retrieves a list of proposals for the authenticated user
 */
export async function getUserProposals() {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized: You must be logged in to view proposals");
    }

    // Get user ID from session
    const userId = session.user.id;

    // Get proposals for the user, sorted by updated date
    const proposals = await prisma.proposal.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return {
      success: true,
      proposals,
    };
  } catch (error) {
    console.error("Error retrieving proposals:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve proposals",
      proposals: [],
    };
  }
}

/**
 * Retrieves a single proposal by ID
 */
export async function getProposalById(id: string) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized: You must be logged in to view a proposal");
    }

    // Get user ID from session
    const userId = session.user.id;

    // Get the proposal
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    // Check if the proposal belongs to the user
    if (proposal.userId !== userId) {
      throw new Error("Unauthorized: You can only view your own proposals");
    }

    return {
      success: true,
      proposal,
    };
  } catch (error) {
    console.error("Error retrieving proposal:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve proposal",
    };
  }
}
