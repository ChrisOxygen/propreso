import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; // Optional: for notifications, install with npm install sonner
import { updateUserProfile } from "../../actions";

/**
 * Hook to update user profile using TanStack Query
 * Handles loading, error, and success states
 * Automatically invalidates relevant queries after successful update
 */
export function useUpdateProfile() {
  const {
    mutate: updateProfile,
    isPending: isUpdatingProfile,
    isSuccess: profileUpdateSuccessfull,
    reset: resetUpdateProfileState,
  } = useMutation({
    mutationFn: updateUserProfile,

    // This runs when the mutation is successful

    // This runs when the mutation encounters an error
    onError: (error: Error) => {
      console.error("Error updating profile:", error);
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  return {
    updateProfile,
    isUpdatingProfile,
    profileUpdateSuccessfull,
    resetUpdateProfileState,
  };
}
