import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { corsHeaders } from "@/utils/cors";

/**
 * GET handler for the session API endpoint
 * Returns the session information for the Chrome extension
 */
export async function GET() {
  try {
    // Get the session using Auth.js
    const session = await auth();

    console.log("session", session);

    // Return appropriate response with CORS headers
    return NextResponse.json(
      {
        session: session ? session : null,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Session API error:", error);

    return NextResponse.json(
      {
        error: "Failed to get session",
        session: null,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}
