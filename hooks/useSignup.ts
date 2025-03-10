import { signupFormSchema } from "@/formSchemas";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Type for the form values
type SignupFormValues = z.infer<typeof signupFormSchema>;

// Hook for signup functionality
export function useSignup() {
  const router = useRouter();

  // Create mutation for signup
  const signupMutation = useMutation({
    mutationFn: async (userData: Omit<SignupFormValues, "confirmPassword">) => {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Get error details from response
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      return response.json();
    },
    onSuccess: () => {
      // Show success message (optional)

      // Redirect to dashboard
      router.push("/login");
    },
    onError: (error: Error) => {
      // Show error message (optional)

      console.error("Signup failed:", error);
    },
  });

  // Submit handler to use with react-hook-form
  const onSubmit = (values: SignupFormValues) => {
    // Remove confirmPassword as it's not needed for the API
    const userData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };

    // Trigger the mutation with form data
    signupMutation.mutate(userData);
  };

  return {
    onSubmit,
    isLoading: signupMutation.isPending,
    error: signupMutation.error,
  };
}
