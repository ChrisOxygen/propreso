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
      <div className="mb-8 relative bg-white pr-6 ">
        <div className="absolute top-4 right-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDialogOpen(true)}
                  className="h-8 w-8 cursor-pointer text-gray-500 hover:text-gray-900"
                  aria-label="Edit bio"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit bio</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-gray-900">{jobTitle}</h1>

        <div className="space-y-2">
          <p className="text-gray-600">{displayBio}</p>

          {shouldTruncate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpand}
              className="text-gray-700 hover:text-gray-900 p-0 h-auto font-medium"
            >
              {isExpanded ? "Show less" : "Read more"}
            </Button>
          )}
        </div>
      </div>
      {/* Add Project Dialog */}
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
