"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart as LineChartIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { weeklyData } from "@/constants/proposal-data";

const ActivityTrendsChart: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState("month");

  return (
    <Card className="bg-white shadow-none hover:shadow-md transition-all">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 uppercase tracking-wider">
          <LineChartIcon className="h-4 w-4" />
          Activity Trends
        </CardTitle>
        <Tabs
          defaultValue="month"
          value={timeFilter}
          onValueChange={setTimeFilter}
          className="w-[250px]"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 pt-3">
        <div className="h-[300px] w-full px-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="week" stroke="#666666" />
              <YAxis stroke="#666666" />
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
              <Legend />
              <Line
                type="monotone"
                dataKey="sent"
                stroke="#000000"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                  fill: "#000000",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
              <Line
                type="monotone"
                dataKey="opened"
                stroke="#666666"
                strokeWidth={2}
                activeDot={{
                  r: 6,
                  fill: "#666666",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
              <Line
                type="monotone"
                dataKey="communication"
                stroke="#999999"
                strokeWidth={2}
                activeDot={{
                  r: 6,
                  fill: "#999999",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
              <Line
                type="monotone"
                dataKey="won"
                stroke="#cccccc"
                strokeWidth={2}
                activeDot={{
                  r: 6,
                  fill: "#cccccc",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTrendsChart;
