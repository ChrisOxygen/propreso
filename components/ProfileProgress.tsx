// components/profile-progress/ProfileProgress.tsx
import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { Progress } from "@/components/ui/progress";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useCheckBio,
  useCheckProjects,
  useProfileProgress,
  useFieldTracking,
} from "@/hooks/profile-hooks";
import { StepGuidance } from "./profile-progress";
import { BioFeedback } from "./profile-progress";
import { ProjectsFeedback } from "./profile-progress";

interface ProfileProgressProps {
  currentStep: number;
  userInformation: {
    jobTitle: string;
    skills: string[];
    bio: string;
    projects: {
      title: string;
      description: string;
      liveLink?: string;
      githubLink?: string;
    }[];
  };
}

// Define the methods that will be exposed via ref
export interface ProfileProgressRef {
  handleBioFocus: () => void;
  handleProjectFocus: (projectIndex: number) => void;
}

const ProfileProgress = forwardRef<ProfileProgressRef, ProfileProgressProps>(
  ({ currentStep, userInformation }, ref) => {
    // Use field tracking hook to track user interactions
    const { bioTouched, projectsTouched, handleBioFocus, handleProjectFocus } =
      useFieldTracking();

    // Debounce the bio and projects only after they've been touched
    const debouncedBio = useDebounce(
      bioTouched ? userInformation.bio : "",
      2000
    );
    const debouncedProjects = useDebounce(userInformation.projects, 2000);

    // Use API hooks
    const {
      mutate: checkBio,
      data: bioFeedback,
      isPending: isBioLoading,
    } = useCheckBio();

    const {
      mutate: checkProjects,
      data: projectsFeedback,
      isPending: isProjectLoading,
    } = useCheckProjects();

    // Calculate profile progress
    const { percentage: progressPercentage, status: progressStatus } =
      useProfileProgress(userInformation, bioFeedback, projectsFeedback);

    // Call API when debounced bio changes (only if it's been touched)
    useEffect(() => {
      if (currentStep === 3 && debouncedBio.trim() && bioTouched) {
        checkBio({ bio: debouncedBio, jobTitle: userInformation.jobTitle });
      }
    }, [
      debouncedBio,
      currentStep,
      checkBio,
      bioTouched,
      userInformation.jobTitle,
    ]);

    // Call API when debounced projects change (only for touched projects)
    useEffect(() => {
      if (
        currentStep === 4 &&
        debouncedProjects.length > 0 &&
        Object.values(projectsTouched).some((v) => v)
      ) {
        // Only include projects that have been touched
        const touchedProjectsData = debouncedProjects.filter(
          (_, index) => projectsTouched[index]
        );

        if (touchedProjectsData.length > 0) {
          checkProjects(touchedProjectsData);
        }
      }
    }, [debouncedProjects, currentStep, checkProjects, projectsTouched]);

    // Expose these methods through a ref that can be accessed by parent component
    useImperativeHandle(
      ref,
      () => ({
        handleBioFocus,
        handleProjectFocus,
      }),
      [handleBioFocus, handleProjectFocus]
    );

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Profile Completeness</h3>
            <span className="text-sm font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-gray-500">{progressStatus}</p>
        </div>

        {/* Current step guidance */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Current Step</h4>

          <StepGuidance
            currentStep={currentStep}
            skillsCount={userInformation.skills.length}
          />

          {currentStep === 3 && bioTouched && (
            <BioFeedback feedback={bioFeedback} isLoading={isBioLoading} />
          )}

          {currentStep === 4 && Object.keys(projectsTouched).length > 0 && (
            <ProjectsFeedback
              feedback={projectsFeedback}
              isLoading={isProjectLoading}
              projects={userInformation.projects}
              touchedProjects={projectsTouched}
            />
          )}
        </div>
      </div>
    );
  }
);

ProfileProgress.displayName = "ProfileProgress";

export default ProfileProgress;
