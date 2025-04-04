"use client";

import GoalsSummary from "@/features/dashboard/components/GoalsSummary";
import ProposalsGraphBox from "@/features/dashboard/components/ProposalsGraphBox";
import RecentProposals from "@/features/dashboard/components/RecentProposals";
import ReferralBox from "@/features/dashboard/components/ReferralBox";
import SummaryBox from "@/features/dashboard/components/SummaryBox";
import InBoxLoader from "@/components/InBoxLoader";
import { useUser } from "@/hooks/useUser";
import CreateProfilePrompt from "@/features/dashboard/components/CreateProfilePrompt";

function DashBoard() {
  const { data: user, isPending } = useUser();

  if (isPending) return <InBoxLoader />;

  return (
    <>
      {user?.hasCreatedProfile ? (
        <>
          <div className="lg:grid flex flex-col-reverse auto-rows-min gap-4 md:grid-cols-[1fr_350px]">
            <ProposalsGraphBox />
            <div className="flex flex-col gap-4 min-h-[200px]">
              <SummaryBox />
              <GoalsSummary />
            </div>
          </div>
          <div className="  min-h-[100vh] flex-1 rounded-xl md:min-h-min ">
            <div className="  min-h-[100vh] lg:grid flex flex-col grid-cols-[1fr_350px] gap-4 h-full rounded-xl md:min-h-min">
              <RecentProposals />
              <ReferralBox />
            </div>
          </div>
        </>
      ) : (
        <CreateProfilePrompt />
      )}
    </>
  );
}

export default DashBoard;
