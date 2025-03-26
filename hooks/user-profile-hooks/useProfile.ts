import { useQuery } from "@tanstack/react-query";

export function useProfile(profileId: string | null) {
  const fetchProfile = async () => {
    if (!profileId) {
      throw new Error("Profile ID is required");
    }

    const response = await fetch(`/api/profiles/${profileId}`);

    if (!response.ok) {
      throw new Error(`Error fetching profile: ${response.status}`);
    }

    const data = await response.json();

    console.log("Profile dat:----------------------", data);

    return data;
  };

  return useQuery<PrismaUserProfile>({
    queryKey: ["profile", profileId],
    queryFn: fetchProfile,
    enabled: !!profileId,

    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}
