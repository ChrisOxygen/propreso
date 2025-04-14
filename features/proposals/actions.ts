// lib/actions/generateProposal.ts
"use server";

import { PrismaClient, ProposalStatus, Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { generateWithOpenAI } from "@/lib/actions";

import { startOfDay, differenceInCalendarDays, format } from "date-fns";

// Initialize Prisma client
type SaveProposalParams = {
  title: string;
  jobDescription: string;
  proposal: string;
  amount?: number;
};

export type GenerateJobTitleParams = {
  jobDescription: string;
  maxLength?: number;
};

export interface JobDataInput {
  jobDescription: string;
  reviewSection?: string;
}

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
        status: "DRAFT",
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
}: SaveProposalParams & { id: string; status?: ProposalStatus }) {
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
      status: ProposalStatus;
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

    if (status !== undefined && ["DRAFT", "SENT", "WON"].includes(status)) {
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
  status: ProposalStatus;
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

    // Validate status - ONLY allow DRAFT, SENT, WON
    if (!["DRAFT", "SENT", "WON"].includes(status)) {
      throw new Error("Invalid status. Must be one of: DRAFT, SENT, WON");
    }

    // Update proposal status
    const updatedProposal = await prisma.proposal.update({
      where: { id },
      data: { status },
    });

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

export async function parseUpworkJob(input: JobDataInput) {
  try {
    console.log("Parsing Upwork job data...");
    const { jobDescription, reviewSection } = input;

    if (!jobDescription) {
      throw new Error("Job description is required");
    }

    let clientName = "";

    // Extract client name from review section if available
    if (reviewSection) {
      const prompt = `
You are an expert at finding names in HTML content. I will provide you with the HTML content of an Upwork job's review section, and your task is to find the name of the job poster/client.

Look for patterns like:

- "[name] was a pleasure to work with"
- "Working with [name] was..."
- Or any other mention of the client's name in the review texts
- exclude names you find in reviews that start with To freelancer: 

Only return the name of the client, with no additional text or explanation. If no name can be found, return an empty string.

Here is the HTML content:
${reviewSection}
`;

      const nameResponse = await generateWithOpenAI({
        prompt,
        max_tokens: 100,
      });

      clientName = nameResponse ? nameResponse.trim() : "";
    }

    // Process the job description - remove line breaks and format for textarea
    let formattedDescription = jobDescription
      .replace(/\n+/g, " ") // Replace consecutive line breaks with a single space
      .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
      .replace(/\. /g, ".\n\n") // Add paragraph breaks after sentences
      .replace(/\• /g, "\n\n• ") // Format bullet points
      .replace(/\- /g, "\n\n- ") // Format dashes
      .replace(/:\s+/g, ":\n\n") // Add breaks after colons
      .trim(); // Remove leading/trailing whitespace

    // Add client name to the beginning if found
    if (clientName) {
      console.log(
        "Client name found:------------------------------",
        clientName
      );
      formattedDescription = `Client: ${clientName}\n\n${formattedDescription}`;
    }

    return {
      success: true,
      data: { formattedDescription },
    };
  } catch (error) {
    console.error("Error processing job data:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to process job data"
    );
  }
}

/**
 * Calculates how many consecutive days a user has created proposals
 * @param userId The ID of the user to calculate streak for
 * @returns The current streak count (0 if streak is broken)
 */
export async function calculateProposalStreak(): Promise<number> {
  // Get the current user session
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorized: You must be logged in");
  }

  // Get user ID from session
  const userId = session.user.id;
  // Get all proposals by the user
  const proposals = await prisma.proposal.findMany({
    where: {
      userId: userId,
    },
    select: {
      createdAt: true,
    },
  });

  if (proposals.length === 0) {
    return 0; // No proposals, no streak
  }

  // Create a set of unique dates when proposals were created
  const uniqueDatesSet = new Set<string>();
  proposals.forEach((proposal) => {
    uniqueDatesSet.add(format(proposal.createdAt, "yyyy-MM-dd"));
  });

  // Convert to array of dates and sort descending (newest first)
  const uniqueDates = Array.from(uniqueDatesSet)
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = startOfDay(new Date());
  const mostRecentDate = uniqueDates[0];

  // Check if streak is still active
  if (differenceInCalendarDays(today, mostRecentDate) > 1) {
    return 0; // Streak is broken if no activity yesterday or today
  }

  // Calculate streak
  let streak = 1; // Start with the most recent day

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentDate = uniqueDates[i];
    const nextDate = uniqueDates[i + 1];

    // If the difference is exactly 1 day, continue the streak
    if (differenceInCalendarDays(currentDate, nextDate) === 1) {
      streak++;
    } else {
      // Break in the streak
      break;
    }
  }

  return streak;
}

/**
 * Counts SENT proposals for current period and calculates trend from previous period
 * @param period The current time period (week, month, or year)
 * @returns Object containing count, trend direction and trend percentage
 */
export async function getSentProposalsCount(period: "week" | "month" | "year") {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized: You must be logged in");
    }

    // Get user ID from session
    const userId = session.user.id;

    // Calculate the start date for current period
    const now = new Date();
    let currentStartDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (period) {
      case "week":
        // Current period: last 7 days
        currentStartDate = new Date(now);
        currentStartDate.setDate(now.getDate() - 6);
        currentStartDate.setHours(0, 0, 0, 0);

        // Previous period: 7 days before that
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setDate(currentStartDate.getDate() - 7);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
        break;

      case "month":
        // Current period: last 30 days
        currentStartDate = new Date(now);
        currentStartDate.setDate(now.getDate() - 29);
        currentStartDate.setHours(0, 0, 0, 0);

        // Previous period: month before that
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setDate(currentStartDate.getDate() - 30);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
        break;

      case "year":
        // Current period: last 365 days
        currentStartDate = new Date(now);
        currentStartDate.setFullYear(now.getFullYear() - 1);
        currentStartDate.setHours(0, 0, 0, 0);

        // Previous period: year before that
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setFullYear(currentStartDate.getFullYear() - 1);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
        break;

      default:
        throw new Error("Invalid period. Must be 'week', 'month', or 'year'");
    }

    // Query for SENT proposals in current period
    const currentCount = await prisma.proposal.count({
      where: {
        userId,
        status: "SENT",
        createdAt: {
          gte: currentStartDate,
        },
      },
    });

    // Query for SENT proposals in previous period
    const previousCount = await prisma.proposal.count({
      where: {
        userId,
        status: "SENT",
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
      },
    });

    // Calculate trend direction and percentage
    let trendDirection: "up" | "down" | "neutral" = "neutral";
    let trendPercentage = 0;

    if (previousCount === 0 && currentCount === 0) {
      // Both zero, no change
      trendDirection = "neutral";
      trendPercentage = 0;
    } else if (previousCount === 0 && currentCount > 0) {
      // From zero to something - positive trend
      trendDirection = "up";
      trendPercentage = 100; // Cap at 100% increase
    } else if (previousCount > 0 && currentCount === 0) {
      // From something to zero - negative trend
      trendDirection = "down";
      trendPercentage = 100; // 100% decrease
    } else {
      // Both non-zero, calculate relative change
      const absoluteChange = currentCount - previousCount;
      const relativeChange = (absoluteChange / previousCount) * 100;
      trendPercentage = Math.abs(Math.round(relativeChange));

      if (absoluteChange > 0) {
        trendDirection = "up";
      } else if (absoluteChange < 0) {
        trendDirection = "down";
      } else {
        trendDirection = "neutral";
      }
    }

    return {
      success: true,
      currentCount,
      previousCount,
      trend: {
        trendDirection,
        trendPercentage,
      },
      period,
    };
  } catch (error) {
    console.error(`Error counting sent proposals for period ${period}:`, error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to count sent proposals",
      currentCount: 0,
      previousCount: 0,
      trend: {
        trendDirection: "neutral",
        trendPercentage: 0,
      },
      period,
    };
  }
}

/**
 * Gets proposal chart data organized by time periods (days, weeks, or months)
 * @param period The time period to analyze (week, month, or year)
 * @returns Array of objects with period labels and status counts
 */
export async function getProposalChartData(period: "week" | "month" | "year") {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized: You must be logged in");
    }

    const userId = session.user.id;

    // Calculate start date based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        // Get the start of the current week (Monday)
        startDate = new Date(now);
        const dayOfWeek = startDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust if Sunday
        startDate.setDate(startDate.getDate() - diff);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "month":
        // Start from 4 weeks ago
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 27); // Get 28 days including today
        startDate.setHours(0, 0, 0, 0);
        break;
      case "year":
        // Start from 1 year ago
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        startDate.setDate(now.getDate() + 1); // Include today
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        throw new Error("Invalid period. Must be 'week', 'month', or 'year'");
    }

    // Get proposals created within the period
    const proposals = await prisma.proposal.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Create period labels based on selected period
    let periodLabels: string[] = [];
    switch (period) {
      case "week":
        periodLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        break;
      case "month":
        periodLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
        break;
      case "year":
        periodLabels = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        break;
    }

    // Initialize result with zero counts for each status
    const chartData = periodLabels.map((label) => ({
      periodTitle: label,
      DRAFT: 0,
      SENT: 0,
      WON: 0,
    }));

    // Process each proposal and count by status and period
    proposals.forEach((proposal) => {
      // Use updatedAt if it differs from createdAt, otherwise use createdAt
      const relevantDate =
        proposal.updatedAt.getTime() !== proposal.createdAt.getTime()
          ? proposal.updatedAt
          : proposal.createdAt;

      // Determine which period bucket this proposal belongs to
      let periodIndex: number;

      switch (period) {
        case "week":
          // Get day of week (0-6, where 0 is Sunday)
          const dayOfWeek = relevantDate.getDay();
          // Convert to our format (0-6, where 0 is Monday)
          periodIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          break;

        case "month":
          // Determine which week the proposal belongs to (0-3)
          const daysSinceStart = Math.floor(
            (relevantDate.getTime() - startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          periodIndex = Math.min(Math.floor(daysSinceStart / 7), 3);
          break;

        case "year":
          // Get month (0-11)
          periodIndex = relevantDate.getMonth();
          break;
      }

      // Increment the appropriate status counter if valid
      if (
        periodIndex >= 0 &&
        periodIndex < chartData.length &&
        ["DRAFT", "SENT", "WON"].includes(proposal.status as string)
      ) {
        chartData[periodIndex][
          proposal.status as keyof (typeof chartData)[0]
        ]++;
      }
    });

    return {
      success: true,
      chartData,
      period,
    };
  } catch (error) {
    console.error(
      `Error getting proposal chart data for period ${period}:`,
      error
    );
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get proposal chart data",
      chartData: [],
      period,
    };
  }
}

/**
 * Calculates proposal win rate and trend compared to previous period
 * @param period The time period to analyze (week, month, or year)
 * @returns Win rate percentage and trend information
 */
export async function getProposalWinRate(period: "week" | "month" | "year") {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized: You must be logged in");
    }

    const userId = session.user.id;

    // Calculate date ranges for current and previous periods
    const now = new Date();
    let currentStartDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (period) {
      case "week":
        // Current period: last 7 days
        currentStartDate = new Date(now);
        currentStartDate.setDate(now.getDate() - 6);
        currentStartDate.setHours(0, 0, 0, 0);

        // Previous period: 7 days before that
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setDate(currentStartDate.getDate() - 7);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
        break;

      case "month":
        // Current period: last 30 days
        currentStartDate = new Date(now);
        currentStartDate.setDate(now.getDate() - 29);
        currentStartDate.setHours(0, 0, 0, 0);

        // Previous period: 30 days before that
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setDate(currentStartDate.getDate() - 30);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
        break;

      case "year":
        // Current period: last 365 days
        currentStartDate = new Date(now);
        currentStartDate.setFullYear(now.getFullYear() - 1);
        currentStartDate.setHours(0, 0, 0, 0);

        // Previous period: year before that
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setFullYear(currentStartDate.getFullYear() - 1);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
        break;

      default:
        throw new Error("Invalid period. Must be 'week', 'month', or 'year'");
    }

    // Get proposals for current period
    const currentProposals = await prisma.proposal.findMany({
      where: {
        userId,
        createdAt: {
          gte: currentStartDate,
        },
      },
      select: {
        status: true,
      },
    });

    // Get proposals for previous period
    const previousProposals = await prisma.proposal.findMany({
      where: {
        userId,
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
      },
      select: {
        status: true,
      },
    });

    // Calculate win rates
    const currentWonCount = currentProposals.filter(
      (p) => p.status === "WON"
    ).length;
    const currentTotal = currentProposals.length;
    const currentWinRate =
      currentTotal > 0 ? (currentWonCount / currentTotal) * 100 : 0;

    const previousWonCount = previousProposals.filter(
      (p) => p.status === "WON"
    ).length;
    const previousTotal = previousProposals.length;
    const previousWinRate =
      previousTotal > 0 ? (previousWonCount / previousTotal) * 100 : 0;

    // Calculate trend direction and percentage
    let trendDirection: "up" | "down" | "neutral" = "neutral";
    let trendPercentage = 0;

    if (previousWinRate === 0 && currentWinRate === 0) {
      // Both zero, no change
      trendDirection = "neutral";
      trendPercentage = 0;
    } else if (previousWinRate === 0 && currentWinRate > 0) {
      // From zero to something - positive trend
      trendDirection = "up";
      trendPercentage = 100; // Cap at 100% increase
    } else if (previousWinRate > 0 && currentWinRate === 0) {
      // From something to zero - negative trend
      trendDirection = "down";
      trendPercentage = 100; // 100% decrease
    } else {
      // Both non-zero, calculate relative change
      const absoluteChange = currentWinRate - previousWinRate;
      const relativeChange = (absoluteChange / previousWinRate) * 100;
      trendPercentage = Math.abs(Math.round(relativeChange));

      if (absoluteChange > 0) {
        trendDirection = "up";
      } else if (absoluteChange < 0) {
        trendDirection = "down";
      } else {
        trendDirection = "neutral";
      }
    }

    return {
      success: true,
      winRate: `${Math.round(currentWinRate)}%`,
      trend: {
        trendDirection,
        trendPercentage,
      },
      period,
    };
  } catch (error) {
    console.error(`Error calculating win rate for period ${period}:`, error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to calculate win rate",
      winRate: "0%",
      trend: {
        trendDirection: "neutral",
        trendPercentage: 0,
      },
      period,
    };
  }
}

// Add this to the existing actions.ts file

/**
 * Deletes a proposal by ID
 * @param id The ID of the proposal to delete
 * @returns Object indicating success or failure with message
 */
export async function deleteProposalById(id: string) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error(
        "Unauthorized: You must be logged in to delete a proposal"
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
      throw new Error("Unauthorized: You can only delete your own proposals");
    }

    // Delete the proposal
    await prisma.proposal.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Proposal deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting proposal:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete proposal"
    );
  }
}

/**
 * Retrieves the 5 most recent proposals for the authenticated user
 * @returns Object containing the most recent proposals or error message
 */
export async function getRecentProposals() {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      throw new Error("Unauthorized: You must be logged in to view proposals");
    }

    // Get user ID from session
    const userId = session.user.id;

    // Get the 5 most recent proposals for the user
    const recentProposals = await prisma.proposal.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    return {
      success: true,
      proposals: recentProposals,
    };
  } catch (error) {
    console.error("Error retrieving recent proposals:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve recent proposals",
      proposals: [],
    };
  }
}

/**
 * Retrieves filtered, sorted and paginated proposals for the authenticated user
 *
 * @param {Object} options - Filter and pagination options
 * @param {string} [options.search=""] - Search term to filter by title and job description
 * @param {ProposalStatus[]} [options.statuses=[]] - Array of proposal statuses to filter by, empty array returns all statuses
 * @param {string} [options.sortField="updatedAt"] - Field to sort results by
 * @param {'asc'|'desc'} [options.sortDirection="desc"] - Sort direction
 * @param {number} [options.page=1] - Current page number (1-based)
 * @param {number} [options.pageSize=10] - Number of items per page
 * @returns {Promise<Object>} Object containing proposals, pagination info, and success status
 */
export async function getFilteredProposals({
  search = "",
  statuses = [],
  sortField = "updatedAt",
  sortDirection = "desc",
  page = 1,
  pageSize = 10,
}: {
  search?: string;
  statuses?: ProposalStatus[];
  sortField?: string;
  sortDirection?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}) {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    // Build query conditions
    const whereClause: Prisma.ProposalWhereInput = { userId };

    // Add search filter
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { jobDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    // Add status filter - only if the array is not empty
    if (statuses.length > 0) {
      whereClause.status = { in: statuses };
    }
    // If statuses array is empty, no filter is applied (return all)

    // Get total count for pagination
    const totalCount = await prisma.proposal.count({ where: whereClause });

    // Get paginated, filtered, and sorted data
    const proposals = await prisma.proposal.findMany({
      where: whereClause,
      orderBy: { [sortField]: sortDirection },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      success: true,
      proposals,
      pagination: {
        total: totalCount,
        pageCount: Math.ceil(totalCount / pageSize),
        page,
        pageSize,
      },
    };
  } catch (error) {
    console.error("Error fetching filtered proposals:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch proposals",
      proposals: [],
      pagination: { total: 0, pageCount: 0, page: 1, pageSize: 10 },
    };
  }
}
