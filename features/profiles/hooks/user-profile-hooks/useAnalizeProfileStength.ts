import { useMutation } from "@tanstack/react-query";
import { analyzeProfileWithAI } from "../../actions";

export function useAnalizeProfileStength(profileId: string | null) {
  return useMutation({
    mutationFn: () => {
      return analyzeProfileWithAI(profileId!);
    },
  });
}
