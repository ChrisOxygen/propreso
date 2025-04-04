import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

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
    // Add your protected routes here, for example:
    "/dashboard/:path*",
    "/profile/:path*",
    // Exclude public routes
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|signup).*)",
  ],
};
