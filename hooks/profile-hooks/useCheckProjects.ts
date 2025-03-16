// hooks/profile-hooks/useCheckProjects.ts
import { useMutation } from "@tanstack/react-query";

interface ProjectComponent {
  name: string;
  description: string;
  examples: string[];
}

interface ProjectFeedbackItem {
  isComplete: boolean;
  missingComponents?: ProjectComponent[];
}

export interface ProjectsFeedbackResponse {
  projects: ProjectFeedbackItem[];
}

interface Project {
  title: string;
  description: string;
  liveLink?: string;
  githubLink?: string;
}

/**
 * Custom hook for checking projects completeness
 * Analyzes projects against completeness criteria
 */
export function useCheckProjects() {
  return useMutation<ProjectsFeedbackResponse, Error, Project[]>({
    mutationFn: async (projects) => {
      if (!projects.length) {
        throw new Error("At least one project is required");
      }

      const response = await fetch("/api/check-project-problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to check projects: ${response.status}`
        );
      }

      return response.json();
    },
  });
}
