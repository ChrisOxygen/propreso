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
import { proposalData } from "@/constants/proposal-data";

const ProposalFunnelChart: React.FC = () => {
  return (
    <Card className="bg-white shadow-none hover:shadow-md transition-all">
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
        <div className="h-[300px] w-full px-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={proposalData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis type="number" stroke="#666666" />
              <YAxis dataKey="name" type="category" stroke="#666666" />
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
                {proposalData.map((entry, index) => (
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
