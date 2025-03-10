"use client";

import InBoxLoader from "@/components/InBoxLoader";
import NoProfile from "@/components/NoProfile";
import { useUser } from "@/hooks/useUser";

function DashBoard() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <InBoxLoader />;

  return (
    <>
      {!user?.hasCreatedProfile ? (
        <NoProfile />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-semibold">Welcome back, {user?.name}</h1>
          <p className="text-lg mt-2">
            You&apos;re logged in with {user?.email}
          </p>
        </div>
      )}
    </>
  );
}

export default DashBoard;
