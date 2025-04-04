import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ExternalLink, Github } from "lucide-react";
import React from "react";

type ViewProjectUIProps = {
  project: Project;
  onEditProject: () => void;
};

function ViewProjectUI({ project, onEditProject }: ViewProjectUIProps) {
  return (
    <div className="space-y-4 py-4">
      <DialogDescription className="text-gray-700 whitespace-pre-line">
        {project.description}
      </DialogDescription>
      <div className="flex flex-wrap gap-4 item-center justify-between pt-4">
        <div className="">
          {project.liveLink && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live Project
              </a>
            </Button>
          )}
          {project.repoLink && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.repoLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-2" />
                View Repository
              </a>
            </Button>
          )}
        </div>
        <Button onClick={onEditProject}>Edit Project</Button>
      </div>
    </div>
  );
}

export default ViewProjectUI;
