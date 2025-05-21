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
              className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="w-3/4">
                  <Skeleton className="h-5 w-full" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>

              <div className="mb-4 flex w-full items-center gap-5 text-sm text-[#404040]">
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
      <div className="hidden overflow-hidden rounded-md md:block">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="font-[Poppins] text-xs font-medium tracking-wider text-[#404040] uppercase">
                Job title
              </TableHead>
              <TableHead className="font-[Poppins] text-xs font-medium tracking-wider text-[#404040] uppercase">
                Date
              </TableHead>
              <TableHead className="font-[Poppins] text-xs font-medium tracking-wider text-[#404040] uppercase">
                Status
              </TableHead>
              <TableHead className="text-right font-[Poppins] text-xs font-medium tracking-wider text-[#404040] uppercase">
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
                  className="border-b border-zinc-100 hover:bg-zinc-50"
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
                    <Skeleton className="ml-auto h-8 w-16" />
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
            className="rounded-lg border border-zinc-100 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="font-[Poppins] font-medium text-[#2C2C2C]">
                  {proposal.title}
                </h3>
              </div>
              <Badge
                className={`${getStatusColor(
                  proposal.status,
                )} flex items-center gap-1.5 font-[Lato]`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white opacity-70"></span>
                {proposal.status}
              </Badge>
            </div>

            <div className="mb-4 flex w-full items-center gap-5 font-[Lato] text-sm tracking-[0.08px] text-[#404040]">
              <div className="flex shrink-0 items-center">
                <Calendar className="mr-1.5 block h-3.5 w-3.5" />
                <span className="block">
                  {formatProposalDate(proposal.createdAt)}
                </span>
              </div>
              <Separator className="shrink" />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full border-zinc-200 font-[Lato] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#BF4008] hover:text-white"
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
      <div className="hidden overflow-hidden rounded-md md:block">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow className="border-y">
              <TableHead className="font-[Poppins] text-xs font-medium tracking-wider text-[#404040] uppercase">
                Job title
              </TableHead>
              <TableHead className="font-[Poppins] text-xs font-medium tracking-wider text-[#404040] uppercase">
                Date
              </TableHead>
              <TableHead className="font-[Poppins] text-xs font-medium tracking-wider text-[#404040] uppercase">
                Status
              </TableHead>
              <TableHead className="text-right font-[Poppins] text-xs font-medium tracking-wider text-[#404040] uppercase">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {displayProposals.map((proposal) => (
              <TableRow
                key={proposal.id}
                className="border-b border-zinc-100 hover:bg-zinc-50"
              >
                <TableCell className="font-[Lato] text-sm text-[#2C2C2C]">
                  {proposal.title}
                </TableCell>
                <TableCell className="font-[Lato] text-sm tracking-[0.08px] text-[#404040]">
                  {formatProposalDate(proposal.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(
                      proposal.status,
                    )} flex w-fit items-center gap-1.5 font-[Lato]`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white opacity-70"></span>
                    {proposal.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-zinc-200 font-[Lato] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#BF4008] hover:text-white"
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
      <Card className={`bg-white transition-all hover:shadow-md ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 font-[Poppins] text-sm font-semibold tracking-wider text-[#2C2C2C] uppercase">
            {icon}
            {title}
          </CardTitle>
          {viewAllHref && (
            <Link href={viewAllHref}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 font-[Lato] text-[#2C2C2C] transition-colors duration-200 hover:text-[#BF4008]"
              >
                {viewAllLabel}
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex h-24 items-center justify-center font-[Lato] tracking-[0.08px] text-[#404040]">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`m-0 border-none bg-white p-0 shadow-none transition-all ${className}`}
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
