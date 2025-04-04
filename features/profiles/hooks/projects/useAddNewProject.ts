// hooks/useAddNewProject.ts
import { useMutation } from "@tanstack/react-query";

import { addNewProject } from "../../actions";
import { ProjectFormValues } from "../../components/ProjectCard";

export function useAddNewProject() {
  const {
    mutate: createNewProject,
    isPending: isCreatingProject,
    isSuccess: projectCreationSuccess,
    reset: resetProjectCreationState,
    isError: projectCreationError,
    data: projectCreationData,
  } = useMutation({
    mutationFn: ({
      formData,
      profileId,
    }: {
      formData: ProjectFormValues;
      profileId: string;
    }) => addNewProject(profileId, formData),
  });

  return {
    createNewProject,
    isCreatingProject,
    projectCreationSuccess,
    resetProjectCreationState,
    projectCreationError,
    projectCreationData,
  };
}
