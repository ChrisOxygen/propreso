import { useQuery } from "@tanstack/react-query";
import { useUserProfiles } from "./useUserProfiles";

export function useDefaultProfile() {
  const { data: profiles, isLoading, error } = useUserProfiles();

  const defaultProfileQuery = useQuery<PrismaUserProfile>({
    queryKey: ["defaultProfile"],
    queryFn: async () => {
      if (!profiles) throw new Error("Profiles not loaded");

      const defaultProfile = profiles.find((profile) => profile.isDefault);

      if (!defaultProfile) {
        // If no default profile is found, use the first profile
        if (profiles.length > 0) return profiles[0];
        throw new Error("No profiles available");
      }

      return defaultProfile;
    },
    enabled: !!profiles && !isLoading && !error,
    staleTime: 5 * 60 * 1000,
  });

  return defaultProfileQuery;
}
