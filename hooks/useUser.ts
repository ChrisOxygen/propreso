"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Define the User type based on your Prisma schema

export const useUser = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      // Redirect to the login page if the session is not available
      router.push("/login");
    }
  }, [session, router]);

  return useQuery<User>({
    queryKey: ["user", session?.user?.id],
    queryFn: async () => {
      if (!session) {
        // Redirect to the login page if the user ID is not available
        router.push("/login");
        return null; // Return null or handle this case as needed
      }

      const response = await fetch(`/api/users/${session.user.id}`);

      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!session?.user?.id, // Only run the query if we have a user ID
  });
};
