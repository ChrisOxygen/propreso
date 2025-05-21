"use client";
import { useProposalDashboard } from "../../context/ProposalsDashboardContext";
import ProposalsTable from "../ProposalsTable";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentProposalsTable = () => {
  const { recentProposals, isLoading } = useProposalDashboard();

  return (
    <Card className="bg-white px-5 transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-5">
        <CardTitle className="flex items-center gap-2 font-[Poppins] text-sm font-semibold tracking-[-0.4px] text-[#2C2C2C] uppercase">
          <FileText className="h-4 w-4" />
          Recent Proposals
        </CardTitle>
        <Link
          href="/proposals"
          className="flex items-center gap-1 font-[Lato] text-sm text-[#404040] transition-colors duration-200 hover:text-[#BF4008]"
        >
          View all proposals
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="p-0 pt-3">
        <ProposalsTable proposals={recentProposals} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default RecentProposalsTable;
