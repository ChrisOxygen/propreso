import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricsData {
  openRate: number;
  winRate: number;
  responseRate: number;
  totalPotentialRevenue: string;
  openRateTrend: { value: number; direction: string };
  winRateTrend: { value: number; direction: string };
  responseRateTrend: { value: number; direction: string };
  revenueTrend: { value: number; direction: string };
  [key: string]: any; // For other potential metrics
}

interface StatCardsProps {
  metrics: MetricsData;
}

const StatCards = ({ metrics }: StatCardsProps) => {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white shadow-none hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
            Open Rate
          </CardDescription>
          <div className="flex items-end">
            <CardTitle className="text-2xl font-bold">
              {metrics.openRate}%
            </CardTitle>
            {getTrendBadge(
              metrics.openRateTrend.direction,
              metrics.openRateTrend.value
            )}
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white shadow-none hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
            Win Rate
          </CardDescription>
          <div className="flex items-end">
            <CardTitle className="text-2xl font-bold">
              {metrics.winRate}%
            </CardTitle>
            {getTrendBadge(
              metrics.winRateTrend.direction,
              metrics.winRateTrend.value
            )}
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white shadow-none hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
            Response Rate
          </CardDescription>
          <div className="flex items-end">
            <CardTitle className="text-2xl font-bold">
              {metrics.responseRate}%
            </CardTitle>
            {getTrendBadge(
              metrics.responseRateTrend.direction,
              metrics.responseRateTrend.value
            )}
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white shadow-none hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
            Potential Revenue
          </CardDescription>
          <div className="flex items-end">
            <CardTitle className="text-2xl font-bold">
              {metrics.totalPotentialRevenue}
            </CardTitle>
            {getTrendBadge(
              metrics.revenueTrend.direction,
              metrics.revenueTrend.value
            )}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default StatCards;
