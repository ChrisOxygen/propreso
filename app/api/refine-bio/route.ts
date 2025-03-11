// app/api/refine-bio/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { currentBio, jobTitle, skills } = await request.json();

    // Validate input
    if (!currentBio || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create prompt for OpenAI
    const prompt = `Refine the following professional bio for a ${jobTitle} with skills in ${skills.join(
      ", "
    )}:
    
    "${currentBio}"
    
    Please improve this bio by:
    1. Making it more concise and compelling
    2. Highlighting key skills more effectively
    3. Improving overall professionalism while keeping a friendly tone
    4. Keeping it in first person
    5. Ensuring it's around 150-200 words
    
    Return only the refined bio text without additional commentary.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Use "gpt-3.5-turbo" for a more cost-effective option
      messages: [
        {
          role: "system",
          content:
            "You are a professional bio editor who refines and improves professional profiles.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    // Extract the refined bio
    const refinedBio = completion.choices[0].message.content?.trim() || "";

    return NextResponse.json({ refinedBio });
  } catch (error) {
    console.error("Error refining bio:", error);
    return NextResponse.json(
      { error: "Failed to refine bio" },
      { status: 500 }
    );
  }
}
