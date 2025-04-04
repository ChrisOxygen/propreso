import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import clsx from "clsx";
import { Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import StengthSuggestions from "./StengthSuggestions";
import { useCheckBio } from "../hooks/useCheckBio";
import { Skeleton } from "@/components/ui/skeleton";
import { BioEvaluationResult } from "../actions";

type StengthDisplayProps = {
  title: string;
  strengthScore: number;
};

function StengthDisplay({ title, strengthScore }: StengthDisplayProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [stengthSuggestions, setStengthSuggestions] = useState<string | null>(
    null
  );

  const { isPending: isAnalizingBio, isSuccess: BioAnalysisReady } =
    useCheckBio();

  console.log("StrengthScore", strengthScore);

  // Determine color based on strength
  const getColorClass = (strengthScore: number): string => {
    if (strengthScore < 30) return "bg-red-50 border-red-200 text-red-800";
    if (strengthScore < 70)
      return "bg-orange-50 border-orange-200 text-orange-800";
    return "bg-green-50 border-green-200 text-green-800";
  };

  if (isAnalizingBio) {
    return (
      <Skeleton className="h-2 mb-3" /> // Show a skeleton loader while analyzing the bio
    );
  }

  if (!strengthScore) {
    return null; // Don't render anything if the strengthScore is null
  }
  const colorClass = getColorClass(strengthScore);

  if (strengthScore >= 85) {
    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">{title} stength</h2>
          <span className="text-sm font-medium">{strengthScore}%</span>
        </div>
        <Progress
          value={strengthScore}
          className={clsx(
            "h-2 mb-3 [&>div]:${progressBarColor}",
            strengthScore >= 75 && "[&>div]:bg-green-500",
            strengthScore >= 50 &&
              strengthScore < 75 &&
              "[&>div]:bg-yellow-500",
            strengthScore >= 25 && strengthScore < 50 && "[&>div]:bg-red-500"
          )}
        />
        <div
          className={clsx(
            "mt-2 p-3 bg-gray-100 rounded-md text-sm",
            colorClass
          )}
        >
          <h4 className="font-medium mb-2">Yor {title} looks great!</h4>
          <p className="">
            Your {title} is strong and well-optimized. Keep up the good work!{" "}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{title} stength</h2>
        <span className="text-sm font-medium">{strengthScore}%</span>
      </div>
      <Progress
        value={strengthScore}
        className={clsx(
          "h-2 mb-3 [&>div]:${progressBarColor}",
          strengthScore >= 75 && "[&>div]:bg-green-500",
          strengthScore >= 50 && strengthScore < 75 && "[&>div]:bg-yellow-500",
          strengthScore >= 25 && strengthScore < 50 && "[&>div]:bg-red-500"
        )}
      />
      {strengthScore <= 85 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 flex items-center text-gray-600 p-0 h-auto hover:bg-transparent hover:text-gray-900"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            <Info className="h-4 w-4 mr-1" />
            {showSuggestions ? "Hide suggestions" : "Show suggestions"}
          </Button>
          <StengthSuggestions
            isVisible={showSuggestions}
            title={title}
            suggestions={stengthSuggestions as string}
            colorClass={colorClass}
          />
        </>
      )}
    </div>
  );
}

export default StengthDisplay;
