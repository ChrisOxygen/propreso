"use client";

import DashboardHeader from "@/features/proposals/components/dashboard/DashboardHeader";

import StatCards from "@/features/proposals/components/dashboard/StatCards";
import ActivityTrendsChart from "@/features/proposals/components/dashboard/ActivityTrendsChart";
import RecentProposalsTable from "@/features/proposals/components/dashboard/RecentProposalsTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProposalDashboardProvider } from "@/features/proposals/context/ProposalsDashboardContext";
import ProposalsBarChart from "@/features/proposals/components/dashboard/ProposalsBarChart";

function ProposalsDashboard() {
  return (
    <ProposalDashboardProvider>
      <ScrollArea className="h-full lg:max-h-[calc(100vh-100px)]">
        <div className="flex flex-col bg-zinc-50 p-4 rounded-2xl md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8">
          {/* Header with create button */}
          <DashboardHeader />

          {/* Quick Stats Row */}
          <StatCards />

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            <ProposalsBarChart />
            <ActivityTrendsChart />
          </div>

          {/* Recent Proposals Table */}
          <RecentProposalsTable />
        </div>
      </ScrollArea>
    </ProposalDashboardProvider>
  );
}

export default ProposalsDashboard;
