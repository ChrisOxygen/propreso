import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, MapPin } from "lucide-react";
import { useProposalDashboard } from "../../context/ProposalsDashboardContext";

const StatCards = () => {
  const {
    winRate,
    winRateTrend,
    currentStreak,
    sentProposalsTrend,
    proposalsSent,
    period,
    isLoading,
  } = useProposalDashboard();

  const getTrendBadge = (direction: string, value: number) => {
    if (direction === "up") {
      return (
        <Badge
          variant="outline"
          className="mb-1 ml-2 border-green-200 bg-green-50 font-[Lato] text-green-600"
        >
          <ArrowUpRight className="mr-1 h-3 w-3" /> {value}%
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="mb-1 ml-2 border-red-200 bg-red-50 font-[Lato] text-red-600"
        >
          <ArrowDownRight className="mr-1 h-3 w-3" /> {value}%
        </Badge>
      );
    }
  };

  // Skeleton components
  const WinRateSkeleton = () => (
    <Card className="bg-white shadow-none">
      <CardHeader className="pb-2">
        <Skeleton className="mb-2 h-4 w-20" />
        <div className="flex items-end">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="ml-2 h-5 w-16" />
        </div>
      </CardHeader>
    </Card>
  );

  const ProposalsSentSkeleton = () => (
    <Card className="bg-white shadow-none">
      <CardHeader className="pb-2">
        <Skeleton className="mb-2 h-4 w-24" />
        <div className="flex items-end">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="ml-2 h-5 w-16" />
        </div>
      </CardHeader>
    </Card>
  );

  const StreakSkeleton = () => (
    <Card className="bg-[#2C2C2C] text-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="mb-2 h-4 w-28 bg-zinc-700" />
            <div className="flex items-end gap-1">
              <Skeleton className="h-8 w-16 bg-zinc-700" />
              <Skeleton className="h-4 w-10 bg-zinc-700" />
            </div>
          </div>
          <Skeleton className="h-9 w-9 rounded-lg bg-zinc-700" />
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-6 md:gap-6 lg:grid-cols-3 lg:gap-8">
      {isLoading ? (
        <WinRateSkeleton />
      ) : (
        <Card className="bg-white transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="font-[Lato] text-xs font-medium tracking-wider text-[#404040] uppercase">
              Win Rate
            </CardDescription>
            <div className="flex items-end">
              <CardTitle className="font-[Poppins] text-2xl font-bold tracking-[-0.4px] text-[#2C2C2C]">
                {winRate}
              </CardTitle>
              {getTrendBadge(winRateTrend.direction, winRateTrend.percentage)}
            </div>
          </CardHeader>
        </Card>
      )}

      {isLoading ? (
        <ProposalsSentSkeleton />
      ) : (
        <Card className="bg-white transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="font-[Lato] text-xs font-medium tracking-wider text-[#404040] uppercase">
              this {period}
            </CardDescription>
            <div className="flex items-end">
              <CardTitle className="font-[Poppins] text-2xl font-bold tracking-[-0.4px] text-[#2C2C2C]">
                {proposalsSent}{" "}
                <span className="font-[Lato] text-xs font-medium tracking-wider text-[#404040] uppercase">
                  Jobs won
                </span>
              </CardTitle>
              {getTrendBadge(
                sentProposalsTrend.direction,
                sentProposalsTrend.percentage,
              )}
            </div>
          </CardHeader>
        </Card>
      )}

      {isLoading ? (
        <StreakSkeleton />
      ) : (
        <Card className="col-span-2 bg-[#2C2C2C] text-white lg:col-span-1">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardDescription className="mb-2 font-[Lato] text-xs font-medium tracking-wider text-zinc-400 uppercase">
                  Current Streak
                </CardDescription>
                <div className="flex items-end gap-1">
                  <CardTitle className="font-[Poppins] text-3xl font-bold tracking-[-0.6px]">
                    {currentStreak}
                  </CardTitle>
                  <span className="mb-1 font-[Lato] text-sm text-zinc-400">
                    days
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-[#404040] p-2">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default StatCards;
