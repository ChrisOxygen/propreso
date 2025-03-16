// components/profile-progress/ProjectsFeedback.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface ProjectComponent {
  name: string;
  description: string;
  examples: string[];
}

interface ProjectFeedbackItem {
  isComplete: boolean;
  missingComponents?: ProjectComponent[];
}

interface ProjectsFeedbackData {
  projects: ProjectFeedbackItem[];
}

interface Project {
  title: string;
  description: string;
  liveLink?: string;
  githubLink?: string;
}

interface ProjectsFeedbackProps {
  feedback: ProjectsFeedbackData | null | undefined;
  isLoading: boolean;
  projects: Project[];
  touchedProjects: { [id: number]: boolean };
}

const ProjectsFeedback: React.FC<ProjectsFeedbackProps> = ({
  feedback,
  isLoading,
  projects,
  touchedProjects,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm italic">Analyzing your projects...</p>
        </CardContent>
      </Card>
    );
  }

  if (!feedback || !feedback.projects || feedback.projects.length === 0) {
    return null;
  }

  // Create an array of indices of projects that have been touched
  const touchedIndices = Object.keys(touchedProjects)
    .filter((key) => touchedProjects[parseInt(key)])
    .map((key) => parseInt(key));

  return (
    <div className="space-y-3">
      {feedback.projects.map((projectFeedback, index) => {
        // Only show feedback for projects that have been touched
        if (!touchedProjects[index]) return null;

        const project = projects[index] || { title: `Project ${index + 1}` };

        return (
          <Card
            key={index}
            className={`border ${
              projectFeedback.isComplete
                ? "border-green-500 bg-green-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                {projectFeedback.isComplete ? (
                  <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <FiAlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {project.title || `Project ${index + 1}`}
                  </p>
                  <p className="text-sm">
                    {projectFeedback.isComplete
                      ? "Congratulations! This project meets all criteria."
                      : "This project needs improvement:"}
                  </p>

                  {!projectFeedback.isComplete &&
                    projectFeedback.missingComponents && (
                      <div className="mt-2 space-y-2">
                        {projectFeedback.missingComponents.map(
                          (component, idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="text-sm font-medium">
                                {component.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {component.description}
                              </p>
                              {component.examples && (
                                <div className="text-xs space-y-1 bg-white p-2 rounded-sm border border-gray-200">
                                  <p className="font-medium">Examples:</p>
                                  {component.examples.map((example, exIdx) => (
                                    <p key={exIdx}>{example}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectsFeedback;
