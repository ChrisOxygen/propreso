"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useUserProfiles() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<PrismaUserProfile[]>({
    queryKey: ["profiles", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID not available");
      }

      const response = await fetch(`/api/profiles`);

      if (!response.ok) {
        throw new Error(`Error fetching profiles: ${response.status}`);
      }

      const data = await response.json();

      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
  });
}
