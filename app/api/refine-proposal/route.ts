// app/api/refine-proposal/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/auth";

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Get request body
    const { originalProposal, jobDescription } = await request.json();

    // Validate input
    if (!originalProposal || !jobDescription) {
      return NextResponse.json(
        { error: "Original proposal and job description are required" },
        { status: 400 }
      );
    }

    // Build the prompt for the AI
    const prompt = `
You are an expert proposal editor for freelancers. Refine and improve the following proposal based on the job description. 

Original job description:
"${jobDescription}"

Original proposal:
"${originalProposal}"

Guidelines for refinement:
1. Ensure the proposal follows the AIDA formula (Attention, Interest, Desire, Action):
   - Attention: Does it start with a compelling hook that shows understanding of the client's needs?
   - Interest: Does it highlight relevant skills and experience?
   - Desire: Does it explain specifically how problems will be solved and results delivered?
   - Action: Does it end with a clear call to action?

2. Make sure the proposal includes all of these essential elements:
   - Clear identification of the client's stated needs AND underlying requirements
   - Relevant suggestions or improvements to the client's project if appropriate
   - Genuine praise for the client's project (specific, not generic)
   - An invitation for a 15-minute call to discuss possibilities with no strings attached
   - A brief paragraph describing a similar project experience

3. Improve the proposal by:
   - Making it more concise and impactful
   - Ensuring personalization to this specific client and project
   - Adding any missing elements from the above list
   - Removing generic language or clichés
   - Making it sound authentic and written by a real person

4. Keep the tone professional, confident but not arrogant, enthusiastic, and personalized.
5. Maintain the same first-person perspective as the original.
6. Keep the proposal between 250-350 words.

Return ONLY the refined proposal, without explanation or commentary.
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Use appropriate model
      messages: [
        {
          role: "system",
          content:
            "You are an expert proposal editor who helps freelancers refine their proposals to win more clients.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract the refined proposal
    const refinedProposal = completion.choices[0].message.content?.trim() || "";

    return NextResponse.json({ refinedProposal });
  } catch (error) {
    console.error("Error refining proposal:", error);
    return NextResponse.json(
      { error: "Failed to refine proposal" },
      { status: 500 }
    );
  }
}
