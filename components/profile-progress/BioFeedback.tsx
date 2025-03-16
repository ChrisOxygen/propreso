// components/profile-progress/BioFeedback.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface BioComponent {
  name: string;
  description: string;
  examples: string[];
}

interface BioFeedbackData {
  isComplete: boolean;
  completionPercentage: number;
  missingComponents?: BioComponent[];
}

interface BioFeedbackProps {
  feedback: BioFeedbackData | null | undefined;
  isLoading: boolean;
}

const BioFeedback: React.FC<BioFeedbackProps> = ({ feedback, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm italic">Analyzing your bio...</p>
        </CardContent>
      </Card>
    );
  }

  if (!feedback) {
    return null;
  }

  return (
    <Card
      className={`border ${
        feedback.isComplete
          ? "border-green-500 bg-green-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-2">
          {feedback.isComplete ? (
            <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <FiAlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          )}
          <div>
            <p className="text-sm font-medium">
              {feedback.isComplete
                ? "Congratulations! Your bio is complete."
                : "Your bio needs improvement:"}
            </p>

            {!feedback.isComplete && feedback.missingComponents && (
              <div className="mt-2 space-y-3">
                {feedback.missingComponents.map((component, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-sm font-medium">
                      Missing: {component.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {component.description}
                    </p>
                    <div className="text-xs space-y-1 bg-white p-2 rounded-sm border border-gray-200">
                      <p className="font-medium">Examples:</p>
                      <p>{component.examples[0]}</p>
                      <p>{component.examples[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BioFeedback;
