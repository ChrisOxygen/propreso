"use server";
import VerifyEmail from "@/react-email-starter/emails/VerifyEmail";
import WelcomeEmail from "@/react-email-starter/emails/WelcomeEmail";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(name: string, email: string) {
  try {
    // Parse the request body to get the user's name

    // Validate the required fields
    if (!name || !email) {
      throw new Error("Name and email are required");
    }

    // Send the welcome email
    await resend.emails.send({
      from: "chris@propreso.com",
      to: email,
      subject: "Welcome to Propreso!",
      react: WelcomeEmail({
        name,
      }),
    });

    return {
      ok: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return {
      ok: false,
      message: "Failed to send welcome email",
    };
  }
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationCode: string,
) {
  try {
    // Validate the required fields
    if (!name || !email || !verificationCode) {
      throw new Error("Name, email, and verificationCode are required");
    }

    // Send the welcome email
    const data = await resend.emails.send({
      from: "verify@propreso.com",
      to: email,
      subject: "Email Verification",
      react: VerifyEmail({
        name,
        verificationCode,
      }),
    });

    return {
      ok: true,
      message: "Email sent successfully",
      data,
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      ok: false,
      message: "Failed to send verification email",
    };
  }
}
