// components/profile-progress/ProfileProgress.tsx
import React, {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { useDebounce } from "@/hooks/useDebounce";
import ProjectsFeedback from "./ProjectsFeedback";
import BioFeedback from "./BioFeedback";
import StepGuidance from "./StepGuidance";

// Define the UserInformation interface that was missing
export interface UserInformation {
  jobTitle: string;
  skills: string[];
  bio: string;
  projects: {
    title: string;
    description: string;
    liveLink?: string;
    githubLink?: string;
  }[];
  isDefaultProfile: boolean;
}

// Define feedback interfaces for proper typing
export interface BioComponent {
  name: string;
  description: string;
  examples: string[];
}

export interface BioFeedbackData {
  isComplete: boolean;
  completionPercentage: number;
  missingComponents?: BioComponent[];
  foundComponents?: number;
}

export interface ProjectFeedbackItem {
  isComplete: boolean;
  missingComponents?: {
    name: string;
    description: string;
    examples: string[];
  }[];
}

export interface ProjectsFeedbackData {
  projects: ProjectFeedbackItem[];
}

interface ProfileProgressProps {
  currentStep: number;
  userInformation: UserInformation;
}

// Define the methods that will be exposed via ref
export interface ProfileProgressRef {
  handleBioFocus: () => void;
  handleProjectFocus: (projectIndex: number) => void;
}

const ProfileProgress = forwardRef<ProfileProgressRef, ProfileProgressProps>(
  ({ currentStep, userInformation }, ref) => {
    // State to track if the bio has been focused/touched
    const [bioTouched, setBioTouched] = useState(false);
    const [projectsTouched, setProjectsTouched] = useState<{
      [id: number]: boolean;
    }>({});

    // State to store feedback data
    const [bioFeedbackData, setBioFeedbackData] =
      useState<BioFeedbackData | null>(null);
    const [projectFeedbackData, setProjectFeedbackData] =
      useState<ProjectsFeedbackData>({ projects: [] });

    // Debounce the bio and projects only after they've been touched
    const debouncedBio = useDebounce(
      bioTouched ? userInformation.bio : "",
      2000
    );

    // We'll handle projects individually when analyzing
    const debouncedProjects = useDebounce(userInformation.projects, 2000);

    // Check bio completeness mutation
    const { mutate: checkBio, isPending: isBioLoading } = useMutation<
      BioFeedbackData,
      Error,
      string
    >({
      mutationFn: async (bio: string) => {
        if (!bio.trim()) return {} as BioFeedbackData;

        const response = await fetch("/api/check-bio-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bio, jobTitle: userInformation.jobTitle }),
        });

        if (!response.ok) throw new Error("Failed to check bio");
        return response.json();
      },
      onSuccess: (data) => {
        setBioFeedbackData(data);
      },
    });

    // Check project problems mutation
    const { mutate: checkProject, isPending: isProjectLoading } = useMutation<
      ProjectsFeedbackData,
      Error,
      typeof userInformation.projects
    >({
      mutationFn: async (projects) => {
        if (!projects.length) return { projects: [] };

        // Only include projects that have been touched/edited
        const touchedProjects = projects.filter(
          (_, index) => projectsTouched[index]
        );

        if (touchedProjects.length === 0) {
          return { projects: [] };
        }

        const response = await fetch("/api/check-project-problems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects: touchedProjects }),
        });

        if (!response.ok) throw new Error("Failed to check projects");
        return response.json();
      },
      onSuccess: (data) => {
        setProjectFeedbackData(data);
      },
    });

    // Call API when debounced bio changes (only if it's been touched)
    useEffect(() => {
      if (currentStep === 3 && debouncedBio.trim() && bioTouched) {
        checkBio(debouncedBio);
      }
    }, [debouncedBio, currentStep, checkBio, bioTouched]);

    // Call API when debounced projects change (only for touched projects)
    useEffect(() => {
      if (
        currentStep === 4 &&
        debouncedProjects.length > 0 &&
        Object.values(projectsTouched).some((v) => v)
      ) {
        checkProject(debouncedProjects);
      }
    }, [debouncedProjects, currentStep, checkProject, projectsTouched]);

    // Method to be called from Step3.tsx component when bio textarea is focused/changed
    const handleBioFocus = useCallback(() => {
      if (!bioTouched) {
        setBioTouched(true);
      }
    }, [bioTouched]);

    // Method to be called from Step4.tsx component when project description is focused/changed
    const handleProjectFocus = useCallback(
      (projectIndex: number) => {
        if (!projectsTouched[projectIndex]) {
          setProjectsTouched((prev) => ({
            ...prev,
            [projectIndex]: true,
          }));
        }
      },
      [projectsTouched]
    );

    // Expose these methods through a ref that can be accessed by parent component
    useImperativeHandle(
      ref,
      () => ({
        handleBioFocus,
        handleProjectFocus,
      }),
      [handleBioFocus, handleProjectFocus]
    );

    // Calculate progress percentages
    const progressPercentage = useMemo(() => {
      let totalProgress = 0;

      // Step 1: Job Title - 10%
      if (userInformation.jobTitle) {
        totalProgress += 10;
      }

      // Step 2: Skills - up to 10%
      if (userInformation.skills.length > 0) {
        const skillsProgress =
          (Math.min(userInformation.skills.length, 6) / 6) * 10;
        totalProgress += skillsProgress;
      }

      // Step 3: Bio - 30%
      if (bioFeedbackData?.isComplete) {
        totalProgress += 30;
      } else if (bioFeedbackData?.completionPercentage) {
        totalProgress += (bioFeedbackData.completionPercentage / 100) * 30;
      }

      // Step 4: Projects - 50%
      if (projectFeedbackData?.projects) {
        const completedProjects = projectFeedbackData.projects.filter(
          (p) => p.isComplete
        ).length;
        // Calculate based on up to 3 complete projects
        const projectProgress = (Math.min(completedProjects, 3) / 3) * 50;
        totalProgress += projectProgress;
      }

      return Math.min(Math.round(totalProgress), 100);
    }, [
      userInformation.jobTitle,
      userInformation.skills.length,
      bioFeedbackData,
      projectFeedbackData,
    ]);

    // Helper function to determine progress status
    const getProgressStatus = (percentage: number) => {
      if (percentage < 25) return "Low";
      if (percentage < 50) return "Getting started";
      if (percentage < 75) return "Good progress";
      if (percentage < 100) return "Almost there";
      return "Complete";
    };

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Profile Completeness</h3>
            <span className="text-sm font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-gray-500">
            {getProgressStatus(progressPercentage)}
          </p>
        </div>

        {/* Current step guidance */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Current Step</h4>

          <StepGuidance
            currentStep={currentStep}
            skillsCount={userInformation.skills.length}
          />

          {currentStep === 3 && bioTouched && (
            <BioFeedback feedback={bioFeedbackData} isLoading={isBioLoading} />
          )}

          {currentStep === 4 && Object.keys(projectsTouched).length > 0 && (
            <ProjectsFeedback
              feedback={projectFeedbackData}
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
