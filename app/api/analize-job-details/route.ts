// File: app/api/parse-upwork-job/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Get HTML content from request body
    const { html } = (await request.json()) as JobDetailsFromPlatform;

    if (!html) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    // The detailed prompt for OpenAI to extract information
    const prompt = `
You are an expert HTML parser specialized in extracting structured information from Upwork job posting pages.

I will provide you with the HTML content of an Upwork job posting page, and you need to extract specific information into a structured JSON format.

Pay special attention to these details:
1. Extract the job title and description (these are required)
2. Determine if the job is hourly or fixed price
3. Extract project length, experience level, and hourly rate range if available
4. List all required skills
5. Extract the number of connects required to apply
6. For client information, extract location, city, rating, number of reviews, jobs posted, hire rate, total spent, and member since date
7. Determine if payment and phone are verified

MOST IMPORTANTLY: Carefully review all client reviews and feedback sections to find the client's name. Look for patterns like "To freelancer: [name]" and any mentions in review texts. If the client's name cannot be found, return an empty string for the clientName field.

Output the data in the following JSON structure:
{
  "jobDetails": {
    "title": "string",
    "description": "string",
    "type": "Hourly" or "Fixed-Price",
    "projectLength": "string",
    "experienceLevel": "string",
    "hourlyRate": {
      "min": "string",
      "max": "string"
    },
    "skills": ["string"],
    "connectsRequired": "string"
  },
  "clientInfo": {
    "clientName": "string",
    "location": "string",
    "city": "string",
    "rating": "string",
    "reviews": "string",
    "jobsPosted": "string",
    "hireRate": "string",
    "totalSpent": "string",
    "memberSince": "string",
    "paymentVerified": boolean,
    "phoneVerified": boolean
  }
}

Here is the HTML content:
${html}

Extract the information and return ONLY the JSON object without any explanation or additional text.
`;

    // Make the API call to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an HTML parser that extracts structured information from Upwork job posting pages.",
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
        { error: "Failed to parse HTML content" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    const parsedData = JSON.parse(content) as AnalizedUpworkJobData;

    // Return the parsed data
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Error parsing Upwork job HTML:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}
