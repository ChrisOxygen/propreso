import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ListPlus,
  ArrowRight,
  ExternalLink,
  Calendar,
  DollarSign,
} from "lucide-react";
import { recentProposals } from "@/constants/proposal-data";
import Link from "next/link";

const RecentProposalsTable: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Won":
        return "bg-black text-white hover:bg-black/90";
      case "Communication":
        return "bg-zinc-800 text-white hover:bg-zinc-800/90";
      case "Opened":
        return "bg-zinc-600 text-white hover:bg-zinc-600/90";
      default:
        return "bg-zinc-200 text-zinc-800 hover:bg-zinc-300/90";
    }
  };

  // Mobile card view renderer
  const renderMobileCards = () => {
    return (
      <div className="space-y-4 md:hidden">
        {recentProposals.map((proposal) => (
          <div
            key={`mobile-${proposal.id}`}
            className="bg-white border border-zinc-100 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs text-zinc-500 block">
                  {proposal.id}
                </span>
                <h3 className="font-medium">{proposal.client}</h3>
              </div>
              <Badge
                className={`${getStatusColor(
                  proposal.status
                )} flex items-center gap-1.5`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white opacity-70"></span>
                {proposal.status}
              </Badge>
            </div>

            <div className="flex items-center text-sm text-zinc-500 mb-4">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>{proposal.date}</span>
              <span className="mx-2">•</span>
              <DollarSign className="w-3.5 h-3.5 mr-1.5" />
              <span>{proposal.value}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full border-zinc-200 hover:border-black hover:text-white hover:bg-black transition-all"
            >
              View Proposal
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  // Desktop/tablet table view renderer
  const renderDesktopTable = () => {
    return (
      <div className="hidden md:block overflow-hidden rounded-md">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                ID
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                Client
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                Date
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                Status
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                Value
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500 text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentProposals.map((proposal) => (
              <TableRow
                key={proposal.id}
                className="hover:bg-zinc-50 border-b border-zinc-100"
              >
                <TableCell className="font-medium text-sm">
                  {proposal.id}
                </TableCell>
                <TableCell className="text-sm">{proposal.client}</TableCell>
                <TableCell className="text-sm">{proposal.date}</TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(
                      proposal.status
                    )} flex w-fit items-center gap-1.5`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white opacity-70"></span>
                    {proposal.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {proposal.value}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-zinc-200 hover:border-black hover:text-white hover:bg-black transition-all"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="bg-white hover:shadow-md transition-all">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 uppercase tracking-wider">
          <ListPlus className="h-4 w-4" />
          Recent Proposals
        </CardTitle>
        <Link href="/proposals/all">
          <Button
            variant="ghost"
            size="sm"
            className="text-black hover:text-zinc-700 h-8"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {/* Mobile card view */}
        {renderMobileCards()}

        {/* Desktop/tablet table view */}
        {renderDesktopTable()}
      </CardContent>
    </Card>
  );
};

export default RecentProposalsTable;
