// hooks/useUpdateProject.ts
import { useMutation } from "@tanstack/react-query";
import { updateProject } from "../../actions";
import { ProjectFormValues } from "./useProjectForm"; // Fix import to avoid circular dependencies

export function useUpdateProject() {
  const {
    mutate,
    isPending: isUpdatingProject,
    isSuccess: projectUpdateSuccess,
    reset: resetProjectUpdateState,
    isError: projectUpdateError,
    data: projectUpdateData,
  } = useMutation({
    mutationFn: ({
      projectId,
      formData,
    }: {
      projectId: string;
      formData: ProjectFormValues;
    }) => updateProject(projectId, formData),
  });

  // Rename to match what's being used in useProjectForm
  const updateExistingProject = mutate;

  return {
    updateExistingProject,
    isUpdatingProject,
    projectUpdateSuccess,
    resetProjectUpdateState,
    projectUpdateError,
    projectUpdateData,
  };
}
