// hooks/useUpdateProject.ts
import { useMutation } from "@tanstack/react-query";

import { updateProject } from "../../actions";
import { ProjectFormValues } from "../../components/projects/ProjectForm";

export function useUpdateProject() {
  const {
    mutate: updateExistingProject,
    isPending: isUpdatingProject,
    isSuccess: projectUpdateSuccess,
    reset: resetProjectUpdateState,
    isError: projectUpdateError,
    data: projectUpdateData,
  } = useMutation({
    mutationFn: ({
      formData,
      projectId,
    }: {
      formData: ProjectFormValues;
      projectId: string;
    }) => updateProject(projectId, formData),
  });

  return {
    updateExistingProject,
    isUpdatingProject,
    projectUpdateSuccess,
    resetProjectUpdateState,
    projectUpdateError,
    projectUpdateData,
  };
}
