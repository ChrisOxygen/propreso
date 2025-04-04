import { useSession } from "next-auth/react";

export function useSetDefaultProfile() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const setAsDefault = async (profileId: string) => {
    if (!userId) {
      throw new Error("User ID not available");
    }

    const response = await fetch(`/api/profiles/${profileId}/set-default`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Error setting default profile: ${response.status}`);
    }

    return response.json();
  };

  return { setAsDefault };
}
