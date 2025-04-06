// hooks/useGenerateJobTitle.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { generateJobTitle } from "../actions";

/**
 * Custom hook to generate job titles using TanStack Query
 * Handles loading, error, and success states
 *
 * @returns Object containing mutation function and state variables
 */
export function useGenerateJobTitle() {
  const {
    mutate: generateTitle,
    isPending: isGeneratingTitle,
    isSuccess: titleGenerationSuccessful,
    isError: titleGenerationError,
    error: titleError,
    reset: resetTitleGenerationState,
    data: generatedTitle,
  } = useMutation({
    mutationFn: generateJobTitle,
  });

  return {
    generateTitle,
    generatedTitle,
    isGeneratingTitle,
    titleGenerationSuccessful,
    titleGenerationError,
    titleError,
    resetTitleGenerationState,
  };
}
