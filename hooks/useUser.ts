import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

// Define the User type based on your Prisma schema

export const useUser = () => {
  const { data: session } = useSession();

  return useQuery<User>({
    queryKey: ["user", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("User ID not found in session");
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
