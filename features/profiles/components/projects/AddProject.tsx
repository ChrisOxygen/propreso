import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiPlus } from "react-icons/fi";

import ProfileDialog from "../ProfileDialog";
import ProjectForm from "./ProjectForm";

interface AddProjectProps {
  profileId: string;
}

export const AddProject: React.FC<AddProjectProps> = ({ profileId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className={`flex h-full w-full cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-colors duration-200 hover:border-[#F8E5DB] hover:bg-[#FDF9F6] hover:shadow`}
        onClick={() => setIsDialogOpen(true)}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-full w-full items-center justify-center">
                <FiPlus className="h-56 w-56 text-[#F8E5DB]" />
                <span className="sr-only">Add new project</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-3 font-[Lato] text-lg tracking-[0.08px] text-[#2C2C2C]">
              <p>Add new project</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Add Project Dialog */}
      <ProfileDialog
        dialogOpen={isDialogOpen}
        setDialogOpen={setIsDialogOpen}
        title="Add New Project"
        description="Fill in the details below to add a new project to your portfolio."
      >
        <ProjectForm
          profileId={profileId}
          setDialogOpen={setIsDialogOpen}
          isEditMode={false}
        />
      </ProfileDialog>
    </>
  );
};

export default AddProject;
