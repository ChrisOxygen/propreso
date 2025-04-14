"use client";
import { useProposalDashboard } from "../../context/ProposalsDashboardContext";
import ProposalsTable from "../ProposalsTable";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react"; // Import icons

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentProposalsTable = () => {
  const { recentProposals, isLoading } = useProposalDashboard();

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" /> {/* Icon added to title */}
          Recent Proposals
        </CardTitle>
        <Link
          href="/proposals"
          className="flex items-center gap-1 text-sm text-black hover:text-gray-500 transition-colors"
        >
          View all proposals
          <ArrowRight className="h-4 w-4" /> {/* Arrow icon added to link */}
        </Link>
      </CardHeader>
      <CardContent>
        <ProposalsTable proposals={recentProposals} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default RecentProposalsTable;
