// app/api/check-project-problems/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { projects } = await request.json();

    if (!projects || !Array.isArray(projects)) {
      return NextResponse.json(
        { error: "Valid projects array is required" },
        { status: 400 }
      );
    }

    // Create analysis for each project
    const projectAnalysisPromises = projects.map(async (project, index) => {
      const prompt = `
You are an expert project reviewer. Analyze the following project details and determine if it meets all requirements for a complete profile project.

Project Title: "${project.title || `Project ${index + 1}`}"
Project Description: "${project.description || ""}"
Live Link: "${project.liveLink || ""}"
GitHub Link: "${project.githubLink || ""}"

A complete project should include these components:
1. Links: At least one of either Live Demo Link or GitHub Repository Link
2. Problem Descriptions: At least two specific problems solved in this project
3. Technologies Used: Specific technologies, libraries, or tools used in the project

For each missing component, provide:
- A description of what's missing
- Two specific examples of how to add this component

Return ONLY a JSON object with this structure:
{
  "isComplete": boolean,
  "missingComponents": [
    {
      "name": "Component Name",
      "description": "Description of what's missing",
      "examples": ["Example 1", "Example 2"]
    }
  ]
}
`;

      // Call OpenAI API for each project
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Use your available model
        messages: [
          {
            role: "system",
            content:
              "You are an expert project reviewer that analyzes project details for completeness.",
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
        throw new Error("Failed to analyze project content");
      }

      // Parse the JSON response
      return JSON.parse(content);
    });

    // Wait for all project analyses to complete
    const projectAnalyses = await Promise.all(projectAnalysisPromises);

    return NextResponse.json({
      projects: projectAnalyses,
    });
  } catch (error) {
    console.error("Error checking projects:", error);
    return NextResponse.json(
      { error: "Failed to analyze projects" },
      { status: 500 }
    );
  }
}
