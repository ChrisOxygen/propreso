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
          className="text-green-600 border-green-200 bg-green-50 ml-2 mb-1"
        >
          <ArrowUpRight className="h-3 w-3 mr-1" /> {value}%
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="text-red-600 border-red-200 bg-red-50 ml-2 mb-1"
        >
          <ArrowDownRight className="h-3 w-3 mr-1" /> {value}%
        </Badge>
      );
    }
  };

  // Skeleton components
  const WinRateSkeleton = () => (
    <Card className="bg-white shadow-none">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-20 mb-2" />
        <div className="flex items-end">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-5 w-16 ml-2" />
        </div>
      </CardHeader>
    </Card>
  );

  const ProposalsSentSkeleton = () => (
    <Card className="bg-white shadow-none">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="flex items-end">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-5 w-16 ml-2" />
        </div>
      </CardHeader>
    </Card>
  );

  const StreakSkeleton = () => (
    <Card className="bg-black text-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="h-4 w-28 mb-2 bg-zinc-700" />
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
    <div className="sm:grid flex flex-col grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {isLoading ? (
        <WinRateSkeleton />
      ) : (
        <Card className="bg-white shadow-none hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Win Rate
            </CardDescription>
            <div className="flex items-end">
              <CardTitle className="text-2xl font-bold">{winRate}</CardTitle>
              {getTrendBadge(winRateTrend.direction, winRateTrend.percentage)}
            </div>
          </CardHeader>
        </Card>
      )}

      {isLoading ? (
        <ProposalsSentSkeleton />
      ) : (
        <Card className="bg-white shadow-none hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              this {period}
            </CardDescription>
            <div className="flex items-end">
              <CardTitle className="text-2xl font-bold">
                {proposalsSent}{" "}
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                  Jobs won
                </span>
              </CardTitle>
              {getTrendBadge(
                sentProposalsTrend.direction,
                sentProposalsTrend.percentage
              )}
            </div>
          </CardHeader>
        </Card>
      )}

      {isLoading ? (
        <StreakSkeleton />
      ) : (
        <Card className="bg-black text-white lg:col-span-1 col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardDescription className="text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                  Current Streak
                </CardDescription>
                <div className="flex items-end gap-1">
                  <CardTitle className="text-3xl font-bold">
                    {currentStreak}
                  </CardTitle>
                  <span className="text-zinc-400 mb-1 text-sm">days</span>
                </div>
              </div>
              <div className="bg-zinc-800 p-2 rounded-lg">
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
