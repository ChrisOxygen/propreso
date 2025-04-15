"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  // Check if it's an authentication error by looking for specific patterns in error messages
  const isAuthError =
    error.message?.toLowerCase().includes("unauthorized") ||
    error.message?.toLowerCase().includes("unauthenticated") ||
    error.message?.toLowerCase().includes("not logged in") ||
    error.message?.toLowerCase().includes("authentication") ||
    error.message?.toLowerCase().includes("sign in") ||
    error.message?.toLowerCase().includes("must be logged in");

  if (isAuthError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-100 max-w-md w-full">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access this page. Please sign in to
            continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default error UI for other types of errors
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          An unexpected error occurred. Please try again or contact support if
          the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={reset}
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
