// app/api/signup/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateVerificationCode } from "@/lib/actions";
import { sendWelcomeEmail } from "@/lib/email-actions";

const prisma = new PrismaClient();

// Input validation schema
const signupSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { firstName, lastName, email, password } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: `${firstName} ${lastName}`,
        hasCreatedProfile: false,
        isVerified: false,
      },
    });

    // Generate verification code for the new user
    await generateVerificationCode(newUser.id);

    // Send welcome email (non-blocking)
    await sendWelcomeEmail(newUser.fullName, email);

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: newUser.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  } finally {
    // Disconnect Prisma client to prevent open handles
    await prisma.$disconnect();
  }
}
