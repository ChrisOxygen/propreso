import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, Sparkles } from "lucide-react";
import FormSuggestions from "../FormSuggestions";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useGenerateProjectDesc from "../../hooks/projects/useGenerateProjectDesc";

import { toast } from "sonner";
import { useAddNewProject } from "../../hooks/projects/useAddNewProject";
import { useQueryClient } from "@tanstack/react-query";
import { Project } from "@prisma/client";
import { useUpdateProject } from "../../hooks/projects/useUpdateProject";

// Define Zod schema for project validation
const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  liveLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  repoLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

type ProjectFormProps = {
  setDialogOpen: (dialogOpen: boolean) => void;
  profileId: string;
  project?: Project;
  exitEditMode?: () => void;
  isEditMode: boolean;
};

function ProjectForm({
  setDialogOpen,
  profileId,
  project,
  exitEditMode,
  isEditMode,
}: ProjectFormProps) {
  // React Hook Form setup with Zod validation
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project ? project.title : "",
      description: project ? project.description : "",
      liveLink: project ? project.liveLink ?? "" : "",
      repoLink: project ? project.repoLink ?? "" : "",
    },
  });

  const queryClient = useQueryClient();

  const {
    generateDesc,
    generatedDescData,
    generateDescSuccessful,
    isGeneratingDesc,
  } = useGenerateProjectDesc();

  const {
    createNewProject,
    isCreatingProject,
    projectCreationSuccess,
    projectCreationData,
  } = useAddNewProject();

  const {
    updateExistingProject,
    isUpdatingProject,
    projectUpdateSuccess,
    projectUpdateData,
  } = useUpdateProject();

  // Handle form submission
  const handleSubmit = (values: ProjectFormValues): void => {
    console.log("Form submitted with values:", values);
    if (project) {
      // Update existing project
      console.log("Updating project:", project.id);
      updateExistingProject({
        formData: values,
        projectId: project.id,
      });

      // Call your update function here with the project ID and new values
    } else {
      // Create new project
      console.log("Creating new project for profile:", profileId);
      createNewProject({
        profileId,
        formData: values,
      });
    }
  };

  if (generateDescSuccessful && generatedDescData) {
    form.setValue("description", generatedDescData.description);
  }

  if (isEditMode) {
    if (projectUpdateSuccess && projectUpdateData) {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["profile", profileId],
      });
      // If your application displays user data elsewhere, you might want to invalidate those queries too
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Project updated successfully!");

      exitEditMode && exitEditMode();
    }
  } else {
    if (projectCreationSuccess && projectCreationData) {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // If your application displays user data elsewhere, you might want to invalidate those queries too
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Project added successfully!");
      setDialogOpen(false);
    }
  }

  const submitButtonText = project ? "Update Project" : "Create Project";
  const submitButtonLoadingText = project
    ? "Updating Project..."
    : "Creating Project...";

  const onCancel = () => {
    if (isEditMode && project) {
      form.setValue("title", project.title);
      form.setValue("description", project.description);
      form.setValue("liveLink", project.liveLink ?? "");
      form.setValue("repoLink", project.repoLink ?? "");
      exitEditMode && exitEditMode();
    } else {
      setDialogOpen(false);
    }
  };

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
              generateDesc({
                title: form.getValues("title"),
                description: form.getValues("description"),
                liveLink: form.getValues("liveLink"),
                repoLink: form.getValues("repoLink"),
              })
            }
            disabled={isGeneratingDesc}
            className="flex items-center gap-2"
          >
            {isGeneratingDesc ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate with AI
          </Button>
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Eg: FlavorFusion - Recipe discovery and meal planning tool"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder="Provide a detailed description of your project..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="liveLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live Link</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://..." />
                </FormControl>
                <FormDescription>
                  URL to the live project (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repoLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repository Link</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://github.com/..." />
                </FormControl>
                <FormDescription>
                  URL to the code repository (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 space-y-4">
          <FormSuggestions />
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isCreatingProject || isUpdatingProject}
          >
            {isCreatingProject || isUpdatingProject ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {submitButtonLoadingText}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {submitButtonText}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default ProjectForm;
