import React, { useState } from "react";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import ProfileSuggestionsUI from "./ProfileSuggestionsUI";
import clsx from "clsx";

type ProfileStengthDisplayProps = {
  profileStength: number;
  profileStengthMessage: string;
};

function ProfileStengthDisplay({
  profileStength,
  profileStengthMessage,
}: ProfileStengthDisplayProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  if (profileStengthMessage === "") {
    return null; // Don't render anything if the message is empty
  }
  if (profileStength === 0) {
    return null; // Don't render anything if the profile strength is 0
  }

  const getColorClass = (strengthScore: number): string => {
    if (strengthScore < 30) return "bg-red-50 border-red-200 text-red-800";
    if (strengthScore < 70)
      return "bg-orange-50 border-orange-200 text-orange-800";
    return "bg-green-50 border-green-200 text-green-800";
  };

  const colorClass = getColorClass(profileStength);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Profile Stength</h2>
        <span className="text-sm font-medium">{profileStength}%</span>
      </div>
      <Progress
        value={profileStength}
        className={clsx(
          "h-2 mb-3 [&>div]:${progressBarColor}",
          profileStength >= 75 && "[&>div]:bg-green-500",
          profileStength >= 50 &&
            profileStength < 75 &&
            "[&>div]:bg-yellow-500",
          profileStength >= 25 && profileStength < 50 && "[&>div]:bg-red-500"
        )}
      />
      {profileStength !== 100 && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 flex items-center text-gray-600 p-0 h-auto hover:bg-transparent hover:text-gray-900"
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          <Info className="h-4 w-4 mr-1" />
          {showSuggestions ? "Hide suggestions" : "Show suggestions"}
        </Button>
      )}
      <ProfileSuggestionsUI
        isVisible={showSuggestions}
        profileStengthMessage={profileStengthMessage}
        colorClass={colorClass}
      />
    </div>
  );
}

export default ProfileStengthDisplay;
