"use client";

import { useMutation } from "@tanstack/react-query";
import { refineBioWithAI } from "../../actions";

function useRefineBioWithAI() {
  const {
    data: refineBioData,
    mutate: refineBio,
    isPending: isRefiningBio,
    isSuccess: refineBioSuccess,
    reset: resetRefineBioState,
  } = useMutation({
    mutationFn: refineBioWithAI,
  });

  return {
    refineBioData,
    refineBio,
    isRefiningBio,
    refineBioSuccess,
    resetRefineBioState,
  };
}

export default useRefineBioWithAI;
