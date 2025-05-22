"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

type GenerateWithOpenAIProps = {
  prompt: string;
  response_format?: string;
  max_tokens?: number;
  temperature?: number;
};

const prisma = new PrismaClient();

export const generateWithOpenAI = async ({
  prompt,
  response_format = "text",
  max_tokens = 300,
  temperature = 0.7,
}: GenerateWithOpenAIProps) => {
  if (!process.env.RAPID_API_KEY) {
    throw new Error("RAPID_API_KEY is not defined");
  }

  // rapid API
  const url =
    "https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host":
        "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
      model: "gpt-4o",
      temperature: temperature,
      max_tokens: max_tokens,
      response_format: { type: response_format },
    }),
  };

  const response = await fetch(url, options);
  const responseOBJ = await response.json();

  const generatedText = responseOBJ.choices[0].message.content.trim() || "";

  return generatedText;
};

/**
 * Server action to update user account information
 * @param data Object containing fullName and/or imageUrl to update
 * @returns Object with success status and message or error
 */
export async function updateUserAccount(data: {
  fullName?: string;
  imageUrl?: string;
}) {
  try {
    // Validate that the user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to update your account",
      };
    }

    // Validate the input data
    const updateSchema = z.object({
      fullName: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .optional(),
      imageUrl: z.string().url("Invalid image URL").optional(),
    });

    // Ensure at least one field is provided
    if (!data.fullName && !data.imageUrl) {
      return {
        success: false,
        message: "No update data provided",
      };
    }

    // Parse and validate the input
    const validatedData = updateSchema.parse(data);

    // Prepare the data object for update
    const updateData: { fullName?: string; image?: string } = {};

    if (validatedData.fullName) {
      updateData.fullName = validatedData.fullName;
    }

    if (validatedData.imageUrl) {
      updateData.image = validatedData.imageUrl;
    }

    // Update the user record in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updateData,
    });

    return {
      success: true,
      message: "Account updated successfully",
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        image: updatedUser.image,
      },
    };
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      return {
        success: false,
        message: errorMessage,
      };
    }

    // Handle other errors
    console.error("Error updating user account:", error);
    return {
      success: false,
      message: "Failed to update account. Please try again later.",
    };
  }
}
