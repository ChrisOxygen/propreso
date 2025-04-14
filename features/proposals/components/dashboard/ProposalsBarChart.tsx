"use client";

import { useState, useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { useProposalDashboard } from "../../context/ProposalsDashboardContext";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ProposalStatus } from "@prisma/client";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function ProposalsBarChart() {
  const { chartData, period, isLoading } = useProposalDashboard();
  const [comparisonFilter, setComparisonFilter] =
    useState<string>("DRAFT-SENT");

  // Check if there's no data to display
  const hasNoData = useMemo(() => {
    if (!chartData || chartData.length === 0) return true;

    // Check if all values are zero
    return chartData.every((item) => {
      return comparisonFilter
        .split("-")
        .every(
          (key) =>
            item[key as ProposalStatus] === 0 ||
            item[key as ProposalStatus] === undefined ||
            item[key as ProposalStatus] === null
        );
    });
  }, [chartData, comparisonFilter]);

  // Description based on period
  const periodDescription = useMemo(() => {
    switch (period) {
      case "year":
        return "Monthly comparison";
      case "month":
        return "Weekly comparison";
      case "week":
        return "Daily comparison";
      default:
        return "Comparison";
    }
  }, [period]);

  return (
    <Card className="bg-white hover:shadow-md px-5 transition-all">
      <CardHeader className="flex flex-row border-b items-center justify-between space-y-0 pb-5">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 uppercase tracking-wider">
            <BarChart3 className="h-4 w-4" />
            Proposal Comparison
          </CardTitle>
        </div>

        {isLoading ? (
          <Skeleton className="h-8 w-[150px]" />
        ) : (
          <Select value={comparisonFilter} onValueChange={setComparisonFilter}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue placeholder="Select comparison" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT-SENT">Draft vs Sent</SelectItem>
              <SelectItem value="DRAFT-WON">Draft vs Won</SelectItem>
              <SelectItem value="SENT-WON">Sent vs Won</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>

      {isLoading ? (
        <Skeleton className="mx-5 h-4 w-32 mt-2" />
      ) : (
        <CardDescription className="pt-1 mx-5">
          {periodDescription}
        </CardDescription>
      )}

      <CardContent className="p-0 pt-3">
        {isLoading ? (
          <div className="p-6 space-y-2">
            <Skeleton className="h-[180px] w-full" />
          </div>
        ) : hasNoData ? (
          <div className="flex items-center justify-center h-[200px] text-zinc-400 text-sm font-medium">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="periodTitle"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              {comparisonFilter.split("-").map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={index === 0 ? "#000000" : "#666666"}
                  radius={4}
                  isAnimationActive={true}
                />
              ))}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default ProposalsBarChart;
