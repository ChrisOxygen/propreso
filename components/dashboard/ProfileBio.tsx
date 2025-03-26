import { Button } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDashboardActions } from "@/hooks/useDashboardActions";

export function ProfileBio() {
  const { activeProfile, expandBio, toggleBioExpand } = useDashboardActions();

  if (!activeProfile) return null;

  const { bio } = activeProfile;
  if (!bio) return <p className="text-gray-500 italic">No bio available</p>;

  const shortBio =
    bio.length > 150 && !expandBio ? bio.substring(0, 150) + "..." : bio;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Professional Bio</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                // onClick={onEdit}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <FiEdit size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit professional bio</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div>
        <p className="text-gray-700">{shortBio}</p>
        {bio.length > 150 && (
          <Button
            variant="link"
            onClick={toggleBioExpand}
            className="p-0 h-auto text-black mt-1"
          >
            {expandBio ? "Read less" : "Read more"}
          </Button>
        )}
      </div>
    </div>
  );
}
