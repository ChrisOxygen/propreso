"use client";

import { ChartPie } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { useProposalDashboard } from "../../context/ProposalsDashboardContext";
import { formatPieChartData } from "../../utils";

const ActivityTrendsChart = () => {
  const { chartData, isLoading } = useProposalDashboard();

  const formattedChartData = formatPieChartData(chartData);

  const chartConfig = {
    numOfProposals: {
      label: "Proposals",
    },
    DRAFT: {
      label: "Draft",
      color: "#BF4008", // Primary brand color
    },
    SENT: {
      label: "Sent",
      color: "#D5754C", // Medium shade of brand color
    },
    WON: {
      label: "Won",
      color: "#F8E5DB", // Light brand color
    },
  } satisfies ChartConfig;

  const totalSentProposals = useMemo(() => {
    return formattedChartData.reduce(
      (acc, curr) => acc + curr.numOfProposals,
      0,
    );
  }, [formattedChartData]);

  // Check if there's no data to display
  const hasNoData = useMemo(() => {
    return (
      !formattedChartData ||
      formattedChartData.length === 0 ||
      formattedChartData.every((item) => item.numOfProposals === 0)
    );
  }, [formattedChartData]);

  return (
    <Card className="bg-white px-5 transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-5">
        <div>
          <CardTitle className="flex items-center gap-2 font-[Poppins] text-sm font-semibold tracking-[-0.4px] text-[#2C2C2C] uppercase">
            <ChartPie className="h-4 w-4" />
            Proposal Distribution
          </CardTitle>
        </div>
      </CardHeader>

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
          <ChartContainer config={chartConfig} className="">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={formattedChartData}
                dataKey="numOfProposals"
                nameKey="status"
                innerRadius={`60%`}
                strokeWidth={`10px`}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="font-[Lato]"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-[#2C2C2C] text-3xl font-bold"
                          >
                            {totalSentProposals.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-[#404040] text-sm"
                          >
                            Total Proposals
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTrendsChart;
