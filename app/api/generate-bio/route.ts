// app/api/generate-bio/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { name, jobTitle, skills } = await request.json();

    // Validate input
    if (!jobTitle || !skills || skills.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create prompt for OpenAI
    const prompt = `Generate a concise and compelling professional bio for ${
      name || "a professional"
    } 
    who works as a ${jobTitle}. They are skilled in ${skills.join(", ")}. 
    The bio should be written in first person, be approximately 150-200 words, 
    highlight their expertise, and sound friendly yet professional. 
    Do not use placeholders or generic statements.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Use "gpt-3.5-turbo" for a more cost-effective option
      messages: [
        {
          role: "system",
          content:
            "You are a professional profile writer who creates concise, compelling professional bios.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    // Extract the generated bio
    const generatedBio = completion.choices[0].message.content?.trim() || "";

    return NextResponse.json({ bio: generatedBio });
  } catch (error) {
    console.error("Error generating bio:", error);
    return NextResponse.json(
      { error: "Failed to generate bio" },
      { status: 500 }
    );
  }
}
