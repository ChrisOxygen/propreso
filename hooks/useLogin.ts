// hooks/useLogin.ts
import { loginFormSchema } from "@/formSchemas";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { z } from "zod";

// Type for the login form values
type LoginFormValues = z.infer<typeof loginFormSchema>;

// Hook for login functionality
export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState("/proposals");

  useEffect(() => {
    // Get and decode the callback URL from query parameters
    const callbackUrl = searchParams.get("callbackUrl");
    console.log("Raw callbackUrl:", callbackUrl);

    if (callbackUrl) {
      // Validate if it's a path we want to redirect to
      const decodedPath = decodeURIComponent(callbackUrl);
      console.log("Decoded path:", decodedPath);
      console.log("Length:", decodedPath.length);
      console.log(
        "Char codes:",
        [...decodedPath].map((c) => c.charCodeAt(0))
      );

      // Check if it's a valid internal path (starting with /)
      console.log("Starts with /:", decodedPath.startsWith("/"));
      if (decodedPath.startsWith("/")) {
        // Check if it's one of our allowed paths
        console.log("Exact match test:", {
          proposals: decodedPath === "/proposals",
          proposalsAll: decodedPath === "/proposals/all",
          profile: decodedPath.startsWith("/profile"),
        });

        if (
          decodedPath === "/proposals" ||
          decodedPath === "/proposals/all" ||
          decodedPath.startsWith("/profile")
        ) {
          setRedirectPath(decodedPath);
          console.log("Redirect path set to:", decodedPath);
        } else {
          console.log("Path matched validation but not allowed paths");
        }
      } else {
        console.log("Path doesn't start with /");
      }
    }
  }, [searchParams]);

  // Submit handler to use with react-hook-form
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.ok) {
        // Redirect to the callback URL or default after successful login
        router.push(redirectPath);
        router.refresh(); // Refresh to update auth state in the UI
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onSubmit,
    isLoading,
    error,
    redirectPath,
  };
}
