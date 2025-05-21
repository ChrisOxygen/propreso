import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ALL_SKILLS } from "@/constants";
import { useState } from "react";
import { useUpdateProfile } from "../hooks/user-profile-hooks/useUpdateProfile";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import EditProfileTips from "./EditProfileTips";

type EditSkillsFormProps = {
  profileId: string;
  skills: string[];
  setDialogOpen: (open: boolean) => void;
  jobTitle: string;
};

function EditSkillsForm({
  profileId,
  skills,
  setDialogOpen,
  jobTitle,
}: EditSkillsFormProps) {
  // Local state to track selected skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(skills || []);

  const queryClient = useQueryClient();

  const {
    updateProfile,
    isUpdatingProfile,
    profileUpdateSuccessfull,
    resetUpdateProfileState,
  } = useUpdateProfile();

  // Get skills for the selected field
  const key = jobTitle
    .split(" ")
    .join("-")
    .toLowerCase() as keyof typeof ALL_SKILLS;

  const fieldSkills = ALL_SKILLS[key as keyof typeof ALL_SKILLS];

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  if (profileUpdateSuccessfull) {
    // Invalidate all profile-related queries to refetch fresh data
    queryClient.invalidateQueries({
      queryKey: ["profile", profileId],
    });
    queryClient.invalidateQueries({ queryKey: ["profiles"] });
    // If your application displays user data elsewhere, you might want to invalidate those queries too
    queryClient.invalidateQueries({ queryKey: ["user"] });
    setDialogOpen(false);
    toast.success("Profile updated successfully");

    resetUpdateProfileState();
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {fieldSkills.length > 0 &&
          fieldSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              className={`rounded-full px-4 py-2 font-[Lato] text-sm font-medium transition-colors duration-200 ${
                selectedSkills.includes(skill)
                  ? "bg-[#BF4008] text-white hover:bg-[#BF4008]/90"
                  : "bg-[#F8E5DB] text-[#404040] hover:bg-[#F8E5DB]/80"
              }`}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </button>
          ))}
      </div>
      {selectedSkills.length > 0 && (
        <p className="mt-4 font-[Lato] text-sm tracking-[0.08px] text-[#404040]">
          Selected: {selectedSkills.length}{" "}
          {selectedSkills.length === 1 ? "skill" : "skills"}
        </p>
      )}
      <EditProfileTips profileProperty="skills" />
      <DialogFooter className="pt-4">
        <Button
          variant="outline"
          disabled={isUpdatingProfile}
          type="button"
          onClick={() => setDialogOpen(false)}
          className="border-zinc-200 bg-white font-[Lato] text-[#2C2C2C] transition-colors duration-200 hover:bg-zinc-50"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            updateProfile({
              profileId,
              skills: selectedSkills,
            });
          }}
          disabled={isUpdatingProfile}
          className="bg-[#BF4008] font-[Lato] font-medium text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
        >
          {isUpdatingProfile ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Skills
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default EditSkillsForm;
