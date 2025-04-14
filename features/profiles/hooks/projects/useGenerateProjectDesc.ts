import { useMutation } from "@tanstack/react-query";
import { generateProjectDescWithAI } from "../../actions";
import { ProjectFormValues } from "./useProjectForm"; // Fix import to avoid circular dependencies

function useGenerateProjectDesc() {
  const {
    mutate: generateDesc,
    isPending: isGeneratingDesc,
    isSuccess: generateDescSuccessful,
    reset: resetGenerateDescState,
    isError: generateDescError,
    data: generatedDescData,
  } = useMutation({
    mutationFn: (formData: ProjectFormValues) =>
      generateProjectDescWithAI(formData),
  });

  return {
    generateDesc,
    isGeneratingDesc,
    generateDescSuccessful,
    resetGenerateDescState,
    generateDescError,
    generatedDescData,
  };
}

export default useGenerateProjectDesc;
