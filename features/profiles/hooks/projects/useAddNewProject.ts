// hooks/useAddNewProject.ts
import { useMutation } from "@tanstack/react-query";
import { addNewProject } from "../../actions";
import { ProjectFormValues } from "./useProjectForm"; // Fix import to avoid circular dependencies

export function useAddNewProject() {
  const {
    mutate,
    isPending: isCreatingProject,
    isSuccess: projectCreationSuccess,
    reset: resetProjectCreationState,
    isError: projectCreationError,
    data: projectCreationData,
  } = useMutation({
    mutationFn: ({
      profileId,
      formData,
    }: {
      profileId: string;
      formData: ProjectFormValues;
    }) => addNewProject(profileId, formData),
  });

  // Rename to match what's being used in useProjectForm
  const createNewProject = mutate;

  return {
    createNewProject,
    isCreatingProject,
    projectCreationSuccess,
    resetProjectCreationState,
    projectCreationError,
    projectCreationData,
  };
}
