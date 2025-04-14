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
import { ListPlus, ArrowRight, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import { formatProposalDate, getStatusColor } from "../utils";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Proposal } from "@prisma/client";

interface ProposalsTableProps {
  proposals: Proposal[];
  title?: string;
  icon?: React.ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
  isLoading?: boolean;
  limit?: number;
  emptyMessage?: string;
  className?: string;
}

const ProposalsTable = ({
  proposals,
  title = "Proposals",
  icon = <ListPlus className="h-4 w-4" />,
  viewAllHref,
  viewAllLabel = "View All",
  isLoading = false,
  limit,
  emptyMessage = "No proposals found.",
  className = "",
}: ProposalsTableProps) => {
  const displayProposals = limit ? proposals.slice(0, limit) : proposals;

  // Mobile skeleton loader
  const renderMobileSkeletons = () => {
    return (
      <div className="space-y-4 md:hidden">
        {Array(limit || 3)
          .fill(0)
          .map((_, index) => (
            <div
              key={`mobile-skeleton-${index}`}
              className="bg-white border border-zinc-100 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-3/4">
                  <Skeleton className="h-5 w-full" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>

              <div className="flex w-full items-center gap-5 text-sm text-zinc-500 mb-4">
                <Skeleton className="h-4 w-28" />
                <Separator className="shrink" />
              </div>

              <Skeleton className="h-9 w-full" />
            </div>
          ))}
      </div>
    );
  };

  // Desktop/tablet skeleton loader
  const renderDesktopSkeletons = () => {
    return (
      <div className="hidden md:block overflow-hidden rounded-md">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                Job title
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                Date
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                Status
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500 text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(limit || 5)
              .fill(0)
              .map((_, index) => (
                <TableRow
                  key={`desktop-skeleton-${index}`}
                  className="hover:bg-zinc-50 border-b border-zinc-100"
                >
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Mobile card view renderer
  const renderMobileCards = () => {
    return (
      <div className="space-y-4 md:hidden">
        {displayProposals.map((proposal) => (
          <div
            key={`mobile-${proposal.id}`}
            className="bg-white border border-zinc-100 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">{proposal.title}</h3>
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

            <div className="flex w-full items-center gap-5 text-sm text-zinc-500 mb-4">
              <div className="flex items-center shrink-0">
                <Calendar className="w-3.5 block h-3.5 mr-1.5" />
                <span className="block">
                  {formatProposalDate(proposal.createdAt)}
                </span>
              </div>
              <Separator className="shrink" />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full border-zinc-200 hover:border-black hover:text-white hover:bg-black transition-all"
              asChild
            >
              <Link href={`/proposals/${proposal.id}`}>
                View Proposal
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Link>
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
            <TableRow className="border-y">
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                Job title
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                Date
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                Status
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500 text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {displayProposals.map((proposal) => (
              <TableRow
                key={proposal.id}
                className="hover:bg-zinc-50 border-b border-zinc-100"
              >
                <TableCell className="text-sm">{proposal.title}</TableCell>
                <TableCell className="text-sm">
                  {formatProposalDate(proposal.createdAt)}
                </TableCell>
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
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-zinc-200 hover:border-black hover:text-white hover:bg-black transition-all"
                    asChild
                  >
                    <Link href={`/proposals/${proposal.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Display empty state
  if (!isLoading && displayProposals.length === 0) {
    return (
      <Card className={`bg-white hover:shadow-md transition-all  ${className}`}>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 uppercase tracking-wider">
            {icon}
            {title}
          </CardTitle>
          {viewAllHref && (
            <Link href={viewAllHref}>
              <Button
                variant="ghost"
                size="sm"
                className="text-black hover:text-zinc-700 h-8"
              >
                {viewAllLabel}
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center text-zinc-500">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-white p-0 m-0 border-none shadow-none transition-all ${className}`}
    >
      <CardContent className="">
        {/* Loading state or content */}
        {isLoading ? (
          <>
            {renderMobileSkeletons()}
            {renderDesktopSkeletons()}
          </>
        ) : (
          <>
            {renderMobileCards()}
            {renderDesktopTable()}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalsTable;
