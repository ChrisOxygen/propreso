import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProfileDialog from "./ProfileDialog";
import EditBioForm from "./EditBioForm";

interface ProfileTitleAndBioProps {
  jobTitle: string;
  bio: string;
  profileId: string;
  skills: string[];
  onEdit?: () => void;
}

const ProfileTitleAndBio: React.FC<ProfileTitleAndBioProps> = ({
  jobTitle,
  bio,
  profileId,
  skills,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const maxLength = 150;

  const shouldTruncate = bio.length > maxLength;
  const displayBio =
    !isExpanded && shouldTruncate ? `${bio.substring(0, maxLength)}...` : bio;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="relative mb-8 bg-white pr-6">
        <div className="absolute top-4 right-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDialogOpen(true)}
                  className="h-8 w-8 cursor-pointer text-[#404040] transition-colors duration-200 hover:text-[#BF4008]"
                  aria-label="Edit bio"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-[Lato]">
                <p>Edit bio</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <h1 className="mb-2 font-[Poppins] text-2xl font-bold tracking-[-0.4px] text-[#2C2C2C]">
          {jobTitle}
        </h1>

        <div className="space-y-2">
          <p className="font-[Lato] tracking-[0.08px] text-[#404040]">
            {displayBio}
          </p>

          {shouldTruncate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpand}
              className="h-auto p-0 font-[Lato] font-medium text-[#404040] transition-colors duration-200 hover:text-[#BF4008]"
            >
              {isExpanded ? "Show less" : "Read more"}
            </Button>
          )}
        </div>
      </div>

      {/* Edit Bio Dialog */}
      <ProfileDialog
        dialogOpen={isDialogOpen}
        setDialogOpen={setIsDialogOpen}
        title="Edit Bio"
        description="Update your bio below."
      >
        <EditBioForm
          profileId={profileId}
          jobTitle={jobTitle}
          skills={skills}
          currentBio={bio}
          setDialogOpen={setIsDialogOpen}
        />
      </ProfileDialog>
    </>
  );
};

export default ProfileTitleAndBio;
