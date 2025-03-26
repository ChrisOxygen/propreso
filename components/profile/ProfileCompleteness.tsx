import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileCompletenessProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  onEditProfile?: () => void;
}

const ProfileCompleteness = ({
  percentage = 75,
  size = 200,
  strokeWidth = 12,
  onEditProfile = () => {},
}: ProfileCompletenessProps) => {
  // Calculate radius and center position
  const center = size / 2;
  const radius = center - strokeWidth;

  // Calculate the circumference of the circle
  const circumference = 2 * Math.PI * radius;

  // Calculate the dash offset based on percentage
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="text-center pb-0">
        <CardTitle>Profile Completeness</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-6">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background circle */}
          <svg width={size} height={size}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#e5e5e5"
              strokeWidth={strokeWidth}
            />

            {/* Progress circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="black"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />

            {/* Percentage text in the middle */}
            <text
              x={center}
              y={center}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="24"
              fontWeight="bold"
            >
              {percentage}%
            </text>
          </svg>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          {percentage < 50 && "Keep going! Your profile needs more info."}
          {percentage >= 50 &&
            percentage < 80 &&
            "Good progress! Almost there."}
          {percentage >= 80 && "Great job! Your profile is almost complete."}
        </div>

        <Button
          onClick={onEditProfile}
          className="mt-6 w-full bg-black text-white hover:bg-gray-800"
        >
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCompleteness;
