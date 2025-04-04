import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Save, Sparkles } from "lucide-react";
import EditProfileTips from "./EditProfileTips";
import { useUpdateProfile } from "../hooks/user-profile-hooks/useUpdateProfile";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import useGenerateBioWithAI from "../hooks/user-profile-hooks/useGenerateBioWithAI";
import useRefineBioWithAI from "../hooks/user-profile-hooks/useRefineBioWithAI";
import { useUser } from "@/hooks/useUser";

// Define Zod schema for project validation
const bioSchema = z.object({
  bio: z.string().min(10, "bio must be at least 30 characters"),
});

export type editBioFormValues = z.infer<typeof bioSchema>;

type EditBioFormProps = {
  setDialogOpen: (dialogOpen: boolean) => void;
  profileId: string;
  currentBio: string;
  skills: string[];
  jobTitle: string;
};

function EditBioForm({
  currentBio,
  setDialogOpen,
  profileId,
  jobTitle,
  skills,
}: EditBioFormProps) {
  const form = useForm<editBioFormValues>({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      bio: currentBio,
    },
  });

  const queryClient = useQueryClient();

  const { updateProfile, isUpdatingProfile, profileUpdateSuccessfull } =
    useUpdateProfile();

  const { data: userData } = useUser();

  const {
    generateBio,
    generateBioSuccessFull,
    generatedBioData,
    genrateBioPending,
    resetGenerateBioState,
  } = useGenerateBioWithAI();

  const {
    refineBioData,
    refineBioSuccess,
    resetRefineBioState,
    refineBio,
    isRefiningBio,
  } = useRefineBioWithAI();

  useEffect(() => {
    if (profileUpdateSuccessfull) {
      // Reset the form to its default values after successful update
      setDialogOpen(false);
      toast.success("Profile updated successfully");
    }
  }, [profileUpdateSuccessfull, setDialogOpen]);

  // Handle form submission
  const handleSubmit = (values: editBioFormValues): void => {
    console.log("Form submitted with values:", values);
    updateProfile({
      profileId,
      bio: values.bio,
    });
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
  }

  if (generateBioSuccessFull) {
    // Update the form with the generated bio
    form.setValue("bio", generatedBioData?.bio || "");
    // Reset the generate bio state
    resetGenerateBioState();
  }

  if (refineBioSuccess) {
    // Update the form with the refined bio
    form.setValue("bio", refineBioData?.refinedBio || "");
    // Reset the generate bio state
    resetRefineBioState();
  }

  const bioText = form.getValues("bio");
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 py-4"
      >
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() =>
              generateBio({
                jobTitle,
                skills,
                name: userData?.fullName as string,
              })
            }
            disabled={genrateBioPending || isRefiningBio || isUpdatingProfile}
            className="flex items-center gap-2"
          >
            {genrateBioPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate with AI
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => refineBio({ bioText, jobTitle, skills })}
            disabled={genrateBioPending || isRefiningBio || isUpdatingProfile}
            className="flex items-center gap-2"
          >
            {isRefiningBio ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refine with AI
          </Button>
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder="Update your bio..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4"></div>
        <div className="mt-6 space-y-4">
          <EditProfileTips profileProperty="bio" />
        </div>

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
            type="submit"
            disabled={isUpdatingProfile || !form.formState.isDirty}
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Bio
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default EditBioForm;
