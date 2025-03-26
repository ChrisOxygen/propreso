"use client";

import GoalsSummary from "@/components/GoalsSummary";
import ProposalsGraphBox from "@/components/ProposalsGraphBox";
import RecentProposals from "@/components/RecentProposals";
import ReferralBox from "@/components/ReferralBox";
import SummaryBox from "@/components/SummaryBox";
import InBoxLoader from "@/components/InBoxLoader";

function DashBoard() {
  const isLoading = false;

  if (isLoading) return <InBoxLoader />;

  return (
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
  );
}

export default DashBoard;
