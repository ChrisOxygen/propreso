import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || "",
    secureCookie: process.env.NODE_ENV === "production" ? true : false,
  });

  console.log("Token:", token); // Log the token for debugging

  // If the user is not authenticated, redirect to the login page
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If the user is authenticated, allow them to proceed
  return NextResponse.next();
}

// Add a matcher for protected routes
export const config = {
  matcher: [
    /*
     * Protected routes that require authentication
     */

    "/settings/:path*",
    "/account/:path*",
    "/proposals/:path*",
    "/profile/:path*",

    /*
     * Exclude these public routes from middleware processing
     * Add your public routes below
     */
  ],
};
