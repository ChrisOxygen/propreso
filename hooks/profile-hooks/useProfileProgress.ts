// hooks/profile-hooks/useProfileProgress.ts
import { useMemo } from "react";
import { BioFeedbackResponse } from "./useCheckBio";
import { ProjectsFeedbackResponse } from "./useCheckProjects";

interface ProfileData {
  jobTitle: string;
  skills: string[];
  bio: string;
  projects: {
    title: string;
    description: string;
    liveLink?: string;
    githubLink?: string;
  }[];
}

interface ProgressResult {
  percentage: number;
  status: string;
}

/**
 * Custom hook to calculate profile completion percentage and status
 * based on the current profile data and feedback from APIs
 */
export function useProfileProgress(
  profileData: ProfileData,
  bioFeedback?: BioFeedbackResponse | null,
  projectsFeedback?: ProjectsFeedbackResponse | null
): ProgressResult {
  const percentage = useMemo(() => {
    let totalProgress = 0;

    // Step 1: Job Title - 10%
    if (profileData.jobTitle) {
      totalProgress += 10;
    }

    // Step 2: Skills - up to 10%
    if (profileData.skills.length > 0) {
      const skillsProgress = (Math.min(profileData.skills.length, 6) / 6) * 10;
      totalProgress += skillsProgress;
    }

    // Step 3: Bio - 30%
    if (bioFeedback?.isComplete) {
      totalProgress += 30;
    } else if (bioFeedback?.completionPercentage) {
      totalProgress += (bioFeedback.completionPercentage / 100) * 30;
    }

    // Step 4: Projects - 50%
    if (projectsFeedback?.projects) {
      const completedProjects = projectsFeedback.projects.filter(
        (p) => p.isComplete
      ).length;
      // Calculate based on up to 3 complete projects
      const projectProgress = (Math.min(completedProjects, 3) / 3) * 50;
      totalProgress += projectProgress;
    }

    return Math.min(Math.round(totalProgress), 100);
  }, [
    profileData.jobTitle,
    profileData.skills.length,
    bioFeedback,
    projectsFeedback,
  ]);

  const status = useMemo(() => {
    if (percentage < 25) return "Low";
    if (percentage < 50) return "Getting started";
    if (percentage < 75) return "Good progress";
    if (percentage < 100) return "Almost there";
    return "Complete";
  }, [percentage]);

  return { percentage, status };
}
