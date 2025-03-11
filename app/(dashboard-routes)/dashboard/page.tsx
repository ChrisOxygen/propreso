"use client";

import DashboardHeader from "@/components/DashboardHeader";
import DashboardProfileSection from "@/components/DashboardProfileSection";
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
        <div className="flex flex-col  h-full w-full">
          <DashboardHeader />
          <DashboardProfileSection />
        </div>
      )}
    </>
  );
}

export default DashBoard;
