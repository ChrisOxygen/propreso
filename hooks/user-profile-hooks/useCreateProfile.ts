// hooks/useCreateProfile.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCreateProfile() {
  const router = useRouter();

  const createProfileMutation = useMutation({
    mutationFn: async (profileData: userProfileData) => {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create profile");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Profile created successfully!");
      // Redirect to dashboard after a brief delay to let the user see the success message
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh(); // Refresh to update the UI state
      }, 500);
    },
    onError: (error: Error) => {
      // Show error toast that disappears after 2 seconds
      toast.error(error.message || "Failed to create profile", {
        duration: 2000,
      });
      console.error("Profile creation failed:", error);
    },
  });

  return {
    createProfile: createProfileMutation.mutate,
    isLoading: createProfileMutation.isPending,
    error: createProfileMutation.error,
  };
}
