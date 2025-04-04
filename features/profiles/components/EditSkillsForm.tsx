import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ALL_SKILLS } from "@/constants";
import { useState } from "react";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
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

  console.log(key);
  const fieldSkills = ALL_SKILLS[key as keyof typeof ALL_SKILLS];

  console.log(fieldSkills);

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  if (profileUpdateSuccessfull) {
    // Refresh the page to reflect the updated profile
    // Reset the form and close the dialog

    //Show success message

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
    console.log("Profile updated successfully");
  }

  // Save skills

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {fieldSkills.length > 0 &&
          fieldSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSkills.includes(skill)
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </button>
          ))}
      </div>
      {selectedSkills.length > 0 && (
        <p className="text-gray-500 mt-4 text-sm">
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
        >
          {isUpdatingProfile ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              updating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Update Skills
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default EditSkillsForm;
