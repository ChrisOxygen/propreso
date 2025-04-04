"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getUserProfiles } from "../../actions";
import { ProfileWithProjects } from "@/app/(main)/profile/page";

export function useUserProfiles() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<ProfileWithProjects[]>({
    queryKey: ["profiles", userId],
    queryFn: () => getUserProfiles(userId as string),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
  });
}
