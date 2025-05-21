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
    color: "#BF4008",
  },
  mobile: {
    label: "Mobile",
    color: "#F8E5DB",
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
            item[key as ProposalStatus] === null,
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
    <Card className="bg-white px-5 transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-5">
        <div>
          <CardTitle className="flex items-center gap-2 font-[Poppins] text-sm font-semibold tracking-[-0.4px] text-[#2C2C2C] uppercase">
            <BarChart3 className="h-4 w-4" />
            Proposal Comparison
          </CardTitle>
        </div>

        {isLoading ? (
          <Skeleton className="h-8 w-[150px]" />
        ) : (
          <Select value={comparisonFilter} onValueChange={setComparisonFilter}>
            <SelectTrigger className="h-8 w-[150px] border-zinc-200 font-[Lato] text-xs text-[#404040]">
              <SelectValue placeholder="Select comparison" />
            </SelectTrigger>
            <SelectContent className="font-[Lato]">
              <SelectItem value="DRAFT-SENT">Draft vs Sent</SelectItem>
              <SelectItem value="DRAFT-WON">Draft vs Won</SelectItem>
              <SelectItem value="SENT-WON">Sent vs Won</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>

      {isLoading ? (
        <Skeleton className="mx-5 mt-2 h-4 w-32" />
      ) : (
        <CardDescription className="mx-5 pt-1 font-[Lato] tracking-[0.08px] text-[#404040]">
          {periodDescription}
        </CardDescription>
      )}

      <CardContent className="p-0 pt-3">
        {isLoading ? (
          <div className="space-y-2 p-6">
            <Skeleton className="h-[180px] w-full" />
          </div>
        ) : hasNoData ? (
          <div className="flex h-[200px] items-center justify-center font-[Lato] text-sm font-medium text-[#404040]">
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
                  fill={index === 0 ? "#BF4008" : "#F8E5DB"}
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
