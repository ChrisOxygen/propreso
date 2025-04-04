import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiPlus } from "react-icons/fi";

import AddProjectForm from "./AddProjectForm";
import ProfileDialog from "../ProfileDialog";

interface AddProjectProps {
  profileId: string;
}

export const AddProject: React.FC<AddProjectProps> = ({ profileId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className={`border border-gray-200 rounded-lg bg-white hover:bg-gray-50 
        transition-colors flex items-center justify-center p-8 cursor-pointer
        shadow-sm hover:shadow w-full h-full`}
        onClick={() => setIsDialogOpen(true)}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-full h-full">
                <FiPlus className="w-56 h-56 text-gray-200" />
                <span className="sr-only">Add new project</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-lg p-3">
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
        <AddProjectForm profileId={profileId} setDialogOpen={setIsDialogOpen} />
      </ProfileDialog>
    </>
  );
};

export default AddProject;
