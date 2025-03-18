// app/api/generate-proposal/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Prisma client
const prisma = new PrismaClient();

export async function POST(request: Request) {
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

    // Get request body
    const {
      jobDescription,
      formula = "aida",
      tone = "professional",
    } = await request.json();

    // Validate input
    if (!jobDescription || jobDescription.trim().length < 10) {
      return NextResponse.json(
        {
          error:
            "Job description is required and must be at least 10 characters",
        },
        { status: 400 }
      );
    }

    // Get user's default profile for personalization
    const userProfile = await prisma.profile.findFirst({
      where: {
        userId: userId,
        isDefault: true,
      },
      include: {
        projects: true,
        user: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "No profile found. Please create a profile first." },
        { status: 400 }
      );
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
- Projects: ${userProfile.projects
      .map((p) => `${p.title}: ${p.description}`)
      .join("; ")}

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
   - A brief paragraph describing a similar project you've worked on (choose the most relevant from the profile info)

3. Use "you" more than "I" and frame capabilities in terms of client benefits.
4. Keep the proposal between 250-350 words, emphasizing quality over quantity.
5. Make sure it reads like it was written by a real person, not AI-generated.
6. Write the proposal in first person as if you are the freelancer.
7. Use active voice, vary sentence structure, and avoid generic phrases and clichés.
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Use appropriate model
      messages: [
        {
          role: "system",
          content:
            "You are an expert proposal writer who helps freelancers win clients with compelling proposals.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract the generated proposal
    const generatedProposal =
      completion.choices[0].message.content?.trim() || "";

    // Save the generated proposal to history (optional)
    // This could be implemented to track proposal history

    return NextResponse.json({ proposal: generatedProposal });
  } catch (error) {
    console.error("Error generating proposal:", error);
    return NextResponse.json(
      { error: "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
