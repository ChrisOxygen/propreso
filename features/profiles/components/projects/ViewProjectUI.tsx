import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { Project } from "@prisma/client";
import { ExternalLink, Github } from "lucide-react";
import React from "react";

type ViewProjectUIProps = {
  project: Project;
  onEditProject: () => void;
};

function ViewProjectUI({ project, onEditProject }: ViewProjectUIProps) {
  return (
    <div className="space-y-4 py-4">
      <DialogDescription className="font-[Lato] tracking-[0.08px] whitespace-pre-line text-[#404040]">
        {project.description}
      </DialogDescription>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <div className="flex flex-wrap gap-2">
          {project.liveLink && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-zinc-200 bg-white font-[Lato] text-[#2C2C2C] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#BF4008] hover:text-white"
              asChild
            >
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live Project
              </a>
            </Button>
          )}
          {project.repoLink && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-zinc-200 bg-white font-[Lato] text-[#2C2C2C] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#BF4008] hover:text-white"
              asChild
            >
              <a
                href={project.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Github className="mr-2 h-4 w-4" />
                View Repository
              </a>
            </Button>
          )}
        </div>
        <Button
          onClick={onEditProject}
          className="bg-[#BF4008] font-[Lato] font-medium text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
        >
          Edit Project
        </Button>
      </div>
    </div>
  );
}

export default ViewProjectUI;
