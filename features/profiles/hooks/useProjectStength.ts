"use client";

import { useMutation } from "@tanstack/react-query";
import { checkProjectStrength } from "../actions";

export function useProjectStength() {
  console.log("useProjectStength--------------------------");
  const {
    mutate,
    isPending: projectStengthPending,
    isError,
    error,
    data,
    isSuccess,
  } = useMutation({
    mutationFn: checkProjectStrength,
    onSuccess: (data) => {
      console.log("Project strength data:", data);
    },
    onError: (error) => {
      console.error("Failed to check project strength:", error);
    },
  });
  return {
    mutate,
    projectStengthPending,
    isError,
    error,
    data,
    isSuccess,
  };
}
