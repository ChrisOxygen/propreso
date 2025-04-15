import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || "",
    secureCookie: process.env.NODE_ENV === "production" ? true : false,
  });

  const { pathname } = request.nextUrl;

  // Check if the current page is an auth page
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  // Case 1: Auth pages - redirect authenticated users to proposals
  if (isAuthPage && token) {
    // User is authenticated but trying to access auth page - redirect to proposals
    const redirectUrl = new URL("/proposals", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Case 2: Protected pages - redirect unauthenticated users to login
  if (!isAuthPage && !token) {
    // User is not authenticated and trying to access protected page - redirect to login
    const loginUrl = new URL("/login", request.url);
    // Save the original URL as callback URL for redirection after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Configure middleware to run on both protected routes and auth pages
export const config = {
  matcher: [
    // Auth pages
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",

    // Protected routes
    "/settings/:path*",
    "/account/:path*",
    "/proposals/:path*",
    "/profile/:path*",
    "/dashboard",
  ],
};
