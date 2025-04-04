import { useMutation } from "@tanstack/react-query";
import { generateProjectDescWithAI } from "../../actions";

function useGenerateProjectDesc() {
  const {
    mutate: generateDesc,
    isPending: isGeneratingDesc,
    isSuccess: generateDescSuccessful,
    reset: resetGenerateDescState,
    isError: generateDescError,
    data: generatedDescData,
  } = useMutation({
    mutationFn: generateProjectDescWithAI,
  });
  return {
    generateDesc,
    isGeneratingDesc,
    generateDescSuccessful,
    resetGenerateDescState, // Uncomment if you have a reset function
    generateDescError, // Uncomment if you have an error state
    generatedDescData, // Uncomment if you have a data state
  };
}

export default useGenerateProjectDesc;
