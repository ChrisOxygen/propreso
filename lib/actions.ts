"use server";

type GenerateWithOpenAIProps = {
  prompt: string;
  response_format?: string;
  max_tokens?: number;
};

export const generateWithOpenAI = async ({
  prompt,
  response_format = "text",
  max_tokens = 300,
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
      temperature: 0.7,
      max_tokens: max_tokens,
      response_format: { type: response_format },
    }),
  };

  const response = await fetch(url, options);
  const responseOBJ = await response.json();

  const generatedText = responseOBJ.choices[0].message.content.trim() || "";

  return generatedText;
};
