import DashboardHeader from "@/features/proposals/components/dashboard/DashboardHeader";
import { calculateMetrics } from "@/constants/proposal-data";
import StatCards from "@/features/proposals/components/dashboard/StatCards";
import FeatureCards from "@/features/proposals/components/dashboard/FeatureCards";
import ProposalFunnelChart from "@/features/proposals/components/dashboard/ProposalFunnelChart";
import ActivityTrendsChart from "@/features/proposals/components/dashboard/ActivityTrendsChart";
import RecentProposalsTable from "@/features/proposals/components/dashboard/RecentProposalsTable";
import { ScrollArea } from "@/components/ui/scroll-area";

function ProposalsDashboard() {
  const metrics = calculateMetrics();
  return (
    <ScrollArea className="h-full lg:max-h-[calc(100vh-100px)]">
      <div className="flex flex-col bg-zinc-50 p-4 rounded-2xl md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8">
        {/* Header with create button */}
        <DashboardHeader />

        {/* Quick Stats Row */}
        <StatCards metrics={metrics} />

        {/* Current Streak and Monthly Count */}
        <FeatureCards
          streak={metrics.currentStreak}
          monthlyProposals={metrics.monthlyProposals}
        />

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProposalFunnelChart />
          <ActivityTrendsChart />
        </div>

        {/* Recent Proposals Table */}
        <RecentProposalsTable />

        {/* Action Recommendations */}
        {/* <AiRecommendations metrics={metrics} /> */}
      </div>
    </ScrollArea>
  );
}

export default ProposalsDashboard;
