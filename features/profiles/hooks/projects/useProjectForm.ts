import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Project } from "@prisma/client";

// Fix import path to match where schema is actually located
import { projectSchema } from "../../schemas/projectSchema";
import useGenerateProjectDesc from "./useGenerateProjectDesc";
import { useAddNewProject } from "./useAddNewProject";
import { useUpdateProject } from "./useUpdateProject";

// Define ProjectFormValues here to avoid circular dependencies
export interface ProjectFormValues {
  title: string;
  description: string;
  liveLink?: string;
  repoLink?: string;
}

interface UseProjectFormProps {
  project?: Project;
  profileId: string;
  setDialogOpen: (dialogOpen: boolean) => void;
  exitEditMode?: () => void;
  isEditMode: boolean;
}

export function useProjectForm({
  project,
  profileId,
  setDialogOpen,
  exitEditMode,
  isEditMode,
}: UseProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project ? project.title : "",
      description: project ? project.description : "",
      liveLink: project?.liveLink || "",
      repoLink: project?.repoLink || "",
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

  // Handle successful description generation
  useEffect(() => {
    if (generateDescSuccessful && generatedDescData) {
      form.setValue("description", generatedDescData.description);
    }
  }, [generateDescSuccessful, generatedDescData, form]);

  // Handle successful project creation/update
  useEffect(() => {
    if (isEditMode && projectUpdateSuccess && projectUpdateData) {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["profile", profileId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Project updated successfully!");

      if (exitEditMode) exitEditMode();
    } else if (!isEditMode && projectCreationSuccess && projectCreationData) {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Project added successfully!");
      setDialogOpen(false);
    }
  }, [
    isEditMode,
    projectUpdateSuccess,
    projectCreationSuccess,
    projectUpdateData,
    projectCreationData,
    queryClient,
    profileId,
    exitEditMode,
    setDialogOpen,
  ]);

  const handleSubmit = (values: ProjectFormValues) => {
    if (isEditMode && project) {
      updateExistingProject({
        projectId: project.id,
        formData: values, // Fix parameter name to match what useUpdateProject expects
      });
    } else {
      createNewProject({
        profileId,
        formData: values, // Fix parameter name to match what useAddNewProject expects
      });
    }
  };

  const onCancel = () => {
    if (isEditMode && exitEditMode) {
      exitEditMode();
    } else {
      setDialogOpen(false);
    }
  };

  const submitButtonText = isEditMode ? "Update Project" : "Add Project";
  const submitButtonLoadingText = isEditMode ? "Updating..." : "Adding...";

  return {
    form,
    generateDesc,
    isGeneratingDesc,
    handleSubmit,
    isCreatingProject,
    isUpdatingProject,
    submitButtonText,
    submitButtonLoadingText,
    onCancel,
  };
}
