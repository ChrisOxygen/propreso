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
      color: "#000",
    },
    SENT: {
      label: "Sent",
      color: "#89987",
    },
    WON: {
      label: "Won",
      color: "#ececec",
    },
  } satisfies ChartConfig;

  const totalSentProposals = useMemo(() => {
    return formattedChartData.reduce(
      (acc, curr) => acc + curr.numOfProposals,
      0
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
    <Card className="bg-white hover:shadow-md px-5 transition-all">
      <CardHeader className="flex flex-row border-b items-center justify-between space-y-0 pb-5">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 uppercase tracking-wider">
            <ChartPie className="h-4 w-4" />
            Proposal Comparison
          </CardTitle>
        </div>
      </CardHeader>

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
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalSentProposals.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Sent Proposals
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
