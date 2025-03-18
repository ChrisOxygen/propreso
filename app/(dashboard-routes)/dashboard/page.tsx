"use client";

import DashboardProfileSection from "@/components/dashboard/DashboardProfileSection";
import DashboardHeader from "@/components/DashboardHeader";
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
          {/* <DashboardProfileSection /> */}
          <DashboardProfileSection />
        </div>
      )}
    </>
  );
}

export default DashBoard;
