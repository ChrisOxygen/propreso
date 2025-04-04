import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDefaultProfile } from "../actions";
import { toast } from "sonner";

/**
 * Hook to set a profile as the default profile using TanStack Query
 * Handles loading, error, and success states
 * Automatically invalidates relevant queries after successful update
 */
export function useSetDefaultProfile() {
  const queryClient = useQueryClient();

  const {
    mutate: setAsDefault,
    isPending: isSettingDefault,
    isSuccess: defaultSetSuccessfully,
    reset: resetDefaultState,
    error,
  } = useMutation({
    mutationFn: setDefaultProfile,

    // This runs when the mutation is successful
    onSuccess: (data, profileId) => {
      if (data.success) {
        // Show success toast
        toast.success("Profile Updated", {
          description:
            data.message || "Profile has been set as default successfully.",
        });

        // Invalidate relevant queries to refetch updated data
        queryClient.invalidateQueries({ queryKey: ["profiles"] });
        queryClient.invalidateQueries({ queryKey: ["profile", profileId] });
        queryClient.invalidateQueries({ queryKey: ["userProfiles"] });
      } else {
        // If the API returned success: false
        toast.error("Update Failed", {
          description: data.message || "Failed to set profile as default.",
        });
      }
    },

    // This runs when the mutation encounters an error
    onError: (error: Error) => {
      console.error("Error setting profile as default:", error);
      toast.error("Error", {
        description: `Failed to set profile as default: ${error.message}`,
      });
    },
  });

  return {
    setAsDefault,
    isSettingDefault,
    defaultSetSuccessfully,
    resetDefaultState,
    error,
  };
}
