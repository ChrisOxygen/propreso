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
      <Card className="h-full flex flex-col shadow-none">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={generateSvgImage(project.title)}
            alt={project.title}
            className="w-full h-full object-cover"
            width={300}
            height={500}
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <CardDescription>{descriptionSnippet}</CardDescription>
        </CardContent>
        <CardFooter className="pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleOpenModal}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {project.liveLink && (
            <Button variant="outline" size="sm" className="h-8">
              <ExternalLink className="h-4 w-4 mr-1" />
              Live
            </Button>
          )}
          {project.repoLink && (
            <Button variant="outline" size="sm" className="h-8">
              <Github className="h-4 w-4 mr-1" />
              Repo
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
