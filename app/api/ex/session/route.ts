import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { corsHeaders } from "@/utils/cors";
import jwt from "jsonwebtoken";

/**
 * GET handler for the session API endpoint
 * Returns the session information for the Chrome extension
 */
export async function GET() {
  try {
    // Get the session using Auth.js
    const session = await auth();

    console.log("session---------", session);

    let extensionToken = null;
    if (session && session.user) {
      // Create a JWT token that the extension can use
      extensionToken = jwt.sign(
        {
          userId: session.user.id,
          email: session.user.email,
          // Include other necessary data but be careful not to include sensitive info
        },
        process.env.NEXTAUTH_SECRET || "default_secret",
        { expiresIn: "30m" }
      );
    }

    // Return appropriate response with CORS headers
    return NextResponse.json(
      {
        session: session ? { ...session, extensionToken } : null,
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
// export async function OPTIONS() {
//   console.log("OPTIONS request received");
//   return NextResponse.json(
//     {},
//     {
//       status: 200,
//       headers: corsHeaders,
//     }
//   );
// }
