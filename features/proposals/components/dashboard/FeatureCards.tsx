import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

interface FeatureCardsProps {
  streak: string;
  monthlyProposals: string;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({
  streak,
  monthlyProposals,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="bg-black text-white">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardDescription className="text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                Current Streak
              </CardDescription>
              <div className="flex items-end gap-1">
                <CardTitle className="text-3xl font-bold">
                  {streak.split(" ")[0]}
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

      <Card className="bg-black text-white">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardDescription className="text-xs uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                This Month
              </CardDescription>
              <div className="flex items-end gap-1">
                <CardTitle className="text-3xl font-bold">
                  {monthlyProposals.split(" ")[0]}
                </CardTitle>
                <span className="text-zinc-400 mb-1 text-sm">proposals</span>
              </div>
            </div>
            <div className="bg-zinc-800 p-2 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default FeatureCards;
