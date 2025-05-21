import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import ProfileDialog from "./ProfileDialog";
import EditSkillsForm from "./EditSkillsForm";

interface ProfileSkillDisplayProps {
  skills: string[];
  profileId: string;
  jobTitle: string;
}

function ProfileSkillDisplay({
  skills,
  profileId,
  jobTitle,
}: ProfileSkillDisplayProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const onEdit = () => {
    setIsDialogOpen(true);
  };

  if (!skills || skills.length === 0) {
    return (
      <div className="relative">
        <p className="font-[Lato] tracking-[0.08px] text-[#404040]">
          No skills available
        </p>
        {renderEditButton(onEdit)}
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className="flex flex-wrap gap-2 pr-10">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-[#F8E5DB] bg-[#F8E5DB] font-[Lato] text-[#BF4008]"
            >
              {skill}
            </Badge>
          ))}
        </div>
        {renderEditButton(onEdit)}
      </div>
      {/* Add Project Dialog */}
      <ProfileDialog
        dialogOpen={isDialogOpen}
        setDialogOpen={setIsDialogOpen}
        title="Edit Skills"
        description="Add or remove skills to your profile"
      >
        <EditSkillsForm
          profileId={profileId}
          skills={skills}
          setDialogOpen={setIsDialogOpen}
          jobTitle={jobTitle}
        />
      </ProfileDialog>
    </>
  );
}

function renderEditButton(onEdit?: () => void) {
  return (
    <div className="absolute top-0 right-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8 text-[#404040] transition-colors duration-200 hover:text-[#BF4008]"
              aria-label="Edit skills"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="font-[Lato]">
            <p>Edit skills</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default ProfileSkillDisplay;
