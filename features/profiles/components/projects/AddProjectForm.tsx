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
import useGenerateProjectDesc from "../../hooks/useGenerateProjectDesc";

import { toast } from "sonner";
import { useAddNewProject } from "../../hooks/projects/useAddNewProject";
import { useQueryClient } from "@tanstack/react-query";

// Define Zod schema for project validation
const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  liveLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  repoLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

type AddProjectFormProps = {
  setDialogOpen: (dialogOpen: boolean) => void;
  profileId: string;
};

function AddProjectForm({ setDialogOpen, profileId }: AddProjectFormProps) {
  // React Hook Form setup with Zod validation
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      liveLink: "",
      repoLink: "",
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

  // Handle form submission
  const handleSubmit = (values: ProjectFormValues): void => {
    console.log("Form submitted with values:", values);
    createNewProject({
      profileId,
      formData: values,
    });
  };

  if (generateDescSuccessful && generatedDescData) {
    form.setValue("description", generatedDescData.description);

    console.log("Generated description:---------------");
    queryClient.invalidateQueries({
      queryKey: ["profile", profileId],
    });
    queryClient.invalidateQueries({ queryKey: ["profiles"] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    // If your application displays user data elsewhere, you might want to invalidate those queries too
    queryClient.invalidateQueries({ queryKey: ["user"] });
  }

  if (projectCreationSuccess && projectCreationData) {
    toast.success("Project added successfully!");
    setDialogOpen(false);
  }
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
          <Button
            variant="outline"
            type="button"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreatingProject}>
            {isCreatingProject ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                creating project...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create project
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default AddProjectForm;
