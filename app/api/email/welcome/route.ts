import { WelcomeEmail } from "@/react-email-starter/emails/WelcomeEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Parse the request body to get the user's name
    const { name, email } = await request.json();

    // Validate the required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    // Send the welcome email
    const data = await resend.emails.send({
      from: "chris@propreso.com",
      to: email,
      subject: "Welcome to Propreso!",
      react: WelcomeEmail({
        name,
      }),
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 },
    );
  }
}
