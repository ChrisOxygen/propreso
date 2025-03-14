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
    const { jobDescription } = await request.json();

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
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "No profile found. Please create a profile first." },
        { status: 400 }
      );
    }

    // Build the prompt for the AI
    const prompt = `
You are an expert proposal writer for freelancers. Create a compelling proposal using the AIDA formula (Attention, Interest, Desire, Action) based on the following job description:

"${jobDescription}"

Use the following personal information for the freelancer:
- Job title: ${userProfile.jobTitle}
- Skills: ${userProfile.skills.join(", ")}
- Bio: ${userProfile.bio}
- Projects: ${userProfile.projects
      .map((p) => `${p.title}: ${p.description}`)
      .join("; ")}

Guidelines for the proposal:
1. First, analyze the job description to clearly identify what the client explicitly wants AND what they likely need (even if not directly stated)
2. Structure using the AIDA formula:
   - Attention: Hook the client with a compelling opening that shows you understand their needs
   - Interest: Highlight your relevant skills and experience
   - Desire: Explain specifically how you can solve their problem and deliver results
   - Action: End with a clear call to action

3. The proposal MUST include:
   - Clear identification of the client's stated needs and underlying requirements
   - Relevant suggestions or improvements to the client's project if appropriate
   - Genuine praise for the client's project (be specific, not generic)
   - An invitation for a 15-minute call to discuss possibilities with no strings attached
   - A brief paragraph describing a similar project you've worked on (choose the most relevant from the profile info)

4. Tone should be professional, confident but not arrogant, enthusiastic, and personalized.
5. Keep the proposal between 250-350 words, emphasizing quality over quantity.
6. Make sure it reads like it was written by a real person, not AI-generated.

Write the proposal in first person as if you are the freelancer.
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
