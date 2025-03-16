// components/profile-progress/StepGuidance.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StepGuidanceProps {
  currentStep: number;
  skillsCount: number;
}

const StepGuidance: React.FC<StepGuidanceProps> = ({
  currentStep,
  skillsCount,
}) => {
  return (
    <>
      {currentStep === 1 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm">
              Select your professional field to gain 10% completion.
            </p>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm">
              Select at least 4 skills to proceed. Selecting 6 or more skills
              will give you full 10% for this step.
            </p>
            <p className="text-sm mt-2 font-medium">
              Current: {skillsCount} skills selected (
              {(Math.min(skillsCount, 6) / 6) * 10}%)
            </p>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm">Create a professional bio that includes:</p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1">
              <li>Professional headline/title</li>
              <li>Value proposition</li>
              <li>Relevant expertise and skills</li>
              <li>Professional background</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm">
              Add at least one project (up to four). Create three complete
              projects to earn 50%. Each project should include:
            </p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1">
              <li>A live link or GitHub link</li>
              <li>
                A description of at least two problems you solved and the
                technologies you used
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default StepGuidance;
