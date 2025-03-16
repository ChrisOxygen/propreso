// app/api/check-bio-complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Extract bio and job title from request
    const { bio, jobTitle } = await request.json();

    if (!bio || !jobTitle) {
      return NextResponse.json(
        { error: "Bio and job title are required" },
        { status: 400 }
      );
    }

    // Create prompt for OpenAI
    const prompt = `
You are an expert profile reviewer. Analyze the following professional bio for a ${jobTitle} and determine if it meets all requirements for a complete profile bio.

Bio text:
"${bio}"

A complete professional bio should include these components:
1. Professional Headline/Title: A concise statement of professional identity and expertise
2. Value Proposition: What unique value or results they provide to clients or employers
3. Relevant Expertise and Skills: Specific technical skills, tools, and methodologies they're proficient in
4. Professional Background: A brief summary of relevant work history or accomplishments

For each missing component, provide:
- A description of what's missing
- Two specific examples of how to add this component

Return ONLY a JSON object with this structure:
{
  "isComplete": boolean,
  "completionPercentage": number, // 0-100 based on components present
  "missingComponents": [
    {
      "name": "Component Name",
      "description": "Description of what's missing",
      "examples": ["Example 1", "Example 2"]
    }
  ],
  "foundComponents": number // Count of components found
}
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Use your available model
      messages: [
        {
          role: "system",
          content:
            "You are an expert profile reviewer that analyzes professional bios for completeness.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    // Extract the JSON response
    const content = completion.choices[0].message.content;

    if (!content) {
      return NextResponse.json(
        { error: "Failed to analyze bio content" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    const analysisData = JSON.parse(content);

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error("Error checking bio:", error);
    return NextResponse.json(
      { error: "Failed to analyze bio" },
      { status: 500 }
    );
  }
}
