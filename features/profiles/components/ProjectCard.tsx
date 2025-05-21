"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ExternalLink, Github, Eye } from "lucide-react";
import Image from "next/image";

import { generateSvgImage } from "../utils";
import ProfileDialog from "./ProfileDialog";
import ViewProjectUI from "./projects/ViewProjectUI";
import { Project } from "@prisma/client";
import ProjectForm from "./projects/ProjectForm";
import Link from "next/link";

type ProjectCardProps = {
  project: Project;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Description truncation
  const MAX_DESCRIPTION_LENGTH = 100;
  const descriptionSnippet =
    project.description.length > MAX_DESCRIPTION_LENGTH
      ? `${project.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
      : project.description;

  // Handle opening the modal
  const handleOpenModal = (): void => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Handle entering edit mode and check strength
  const handleEnterEditMode = (): void => {
    setIsEditMode(true);
  };

  const exitEditMode = (): void => {
    setIsEditMode(false);
  };

  return (
    <>
      <Card className="flex h-full flex-col border-zinc-200 shadow-none">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={generateSvgImage(project.title)}
            alt={project.title}
            className="h-full w-full object-cover"
            width={300}
            height={500}
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="font-[Poppins] text-lg font-semibold tracking-[-0.4px] text-[#2C2C2C]">
            {project.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <CardDescription className="font-[Lato] tracking-[0.08px] text-[#404040]">
            {descriptionSnippet}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex gap-2 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-zinc-200 bg-white font-[Lato] text-[#2C2C2C] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#BF4008] hover:text-white"
            onClick={handleOpenModal}
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
          {project.liveLink && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-zinc-200 bg-white font-[Lato] text-[#2C2C2C] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#BF4008] hover:text-white"
              asChild
            >
              <Link
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="mr-1 h-4 w-4" />
                Live
              </Link>
            </Button>
          )}
          {project.repoLink && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-zinc-200 bg-white font-[Lato] text-[#2C2C2C] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#BF4008] hover:text-white"
              asChild
            >
              <Link
                href={project.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Github className="mr-1 h-4 w-4" />
                Repo
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Project View/Edit Modal */}
      <ProfileDialog
        dialogOpen={isModalOpen}
        setDialogOpen={setIsModalOpen}
        title={isEditMode ? "Edit Project" : "Project Details"}
        description={isEditMode ? "Edit your project details" : ""}
      >
        {isEditMode ? (
          <ProjectForm
            project={project}
            profileId={project.profileId}
            setDialogOpen={setIsModalOpen}
            isEditMode={isEditMode}
            exitEditMode={exitEditMode}
          />
        ) : (
          <ViewProjectUI
            project={project}
            onEditProject={handleEnterEditMode}
          />
        )}
      </ProfileDialog>
    </>
  );
};

export default ProjectCard;
