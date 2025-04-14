"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useProposalDashboard } from "../../context/ProposalsDashboardContext";
import { formatChartDataWithColors } from "../../utils";

const ProposalFunnelChart = () => {
  const { chartData } = useProposalDashboard();
  const transformedChartData: Array<{ status: string; count: number }> = [];

  if (chartData && chartData.length > 0) {
    // Convert the data format to what formatChartDataWithColors expects
    Object.entries(chartData[0])
      .filter(
        ([key]) =>
          key !== "periodTitle" && ["DRAFT", "SENT", "WON"].includes(key)
      )
      .forEach(([key]) => {
        transformedChartData.push({
          status: key,
          count: chartData.reduce(
            (sum, item) => sum + (item[key as keyof typeof item] as number),
            0
          ),
        });
      });
  }

  const formattedChartData = formatChartDataWithColors(transformedChartData);

  return (
    <Card className="bg-white col-span-2 shadow-none px-3 hover:shadow-md transition-all">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 uppercase tracking-wider">
          <BarChart3 className="h-4 w-4" />
          Proposal Funnel
        </CardTitle>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-zinc-200"></div>
          <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
          <div className="w-2 h-2 rounded-full bg-zinc-400"></div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-3">
        <div className="h-[300px] w-full ">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis type="number" stroke="#666666" />
              <YAxis
                dataKey="name"
                width={120}
                type="category"
                stroke="#666666"
                tick={{ fontSize: 14 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "black",
                  borderColor: "#000",
                  borderRadius: "8px",
                  color: "white",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "white" }}
                labelStyle={{ color: "white" }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {formattedChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalFunnelChart;
