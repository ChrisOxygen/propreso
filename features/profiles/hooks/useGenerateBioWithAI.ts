"use client";

import { useMutation } from "@tanstack/react-query";
import { generateBioWithAI } from "../actions";

function useGenerateBioWithAI() {
  const {
    data: generatedBioData,
    mutate: generateBio,
    isPending: genrateBioPending,
    isSuccess: generateBioSuccessFull,
    reset: resetGenerateBioState,
    isError: generateBioError,
  } = useMutation({
    mutationFn: generateBioWithAI,
  });

  return {
    generatedBioData,
    generateBio,
    genrateBioPending,
    generateBioSuccessFull,
    resetGenerateBioState,
    generateBioError,
  };
}

export default useGenerateBioWithAI;
