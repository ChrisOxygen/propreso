// hooks/profile-hooks/useCheckBio.ts
import { useMutation } from "@tanstack/react-query";
import { evaluateBioWithAI } from "../actions";

/**
 * Custom hook for checking bio completeness
 * Analyzes a professional bio against completeness criteria
 */
export function useCheckBio() {
  return useMutation({
    mutationFn: ({ roleTitle, bio }: { roleTitle: string; bio: string }) =>
      evaluateBioWithAI(roleTitle, bio),
  });
}
