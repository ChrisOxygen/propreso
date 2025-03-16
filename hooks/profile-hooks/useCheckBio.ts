// hooks/profile-hooks/useCheckBio.ts
import { useMutation } from "@tanstack/react-query";

interface BioComponent {
  name: string;
  description: string;
  examples: string[];
}

export interface BioFeedbackResponse {
  isComplete: boolean;
  completionPercentage: number;
  missingComponents?: BioComponent[];
  foundComponents?: number;
}

interface CheckBioParams {
  bio: string;
  jobTitle: string;
}

/**
 * Custom hook for checking bio completeness
 * Analyzes a professional bio against completeness criteria
 */
export function useCheckBio() {
  return useMutation<BioFeedbackResponse, Error, CheckBioParams>({
    mutationFn: async ({ bio, jobTitle }) => {
      if (!bio.trim() || !jobTitle) {
        throw new Error("Bio and job title are required");
      }

      const response = await fetch("/api/check-bio-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, jobTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to check bio: ${response.status}`
        );
      }

      return response.json();
    },
  });
}
