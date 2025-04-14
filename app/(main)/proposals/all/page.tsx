"use client";

import DashboardHeader from "@/features/proposals/components/dashboard/DashboardHeader";
import { ProposalsListProvider } from "@/features/proposals/context/ProposalsListContext";
import AllProposals from "@/features/proposals/components/AllProposals";

const AllProposalsPage = () => {
  return (
    <ProposalsListProvider>
      <div className="container mx-auto py-8 px-0 md:px-6">
        <div className="px-6">
          <DashboardHeader />
        </div>
        <AllProposals />
      </div>
    </ProposalsListProvider>
  );
};

export default AllProposalsPage;
