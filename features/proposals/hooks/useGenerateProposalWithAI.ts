import { useMutation } from "@tanstack/react-query";
import {
  generateProposalWithAI,
  GenerateProposalWithAIParams,
} from "../actions";

interface UseGenerateProposalWithAIProps {
  onMutate?: () => void;
  onSuccess?: (proposal: string) => void;
  onError?: (error: Error) => void;
}

export function useGenerateProposalWithAI({
  onMutate,
  onSuccess,
  onError,
}: UseGenerateProposalWithAIProps = {}) {
  const mutation = useMutation({
    mutationFn: generateProposalWithAI,
    onMutate: () => {
      if (onMutate) onMutate();
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data.proposal);
    },
    onError: (error: Error) => {
      console.error("Error generating proposal:", error);
      if (onError) onError(error);
    },
  });

  const generateProposal = (params: GenerateProposalWithAIParams) => {
    mutation.mutate(params);
  };

  return {
    generateProposal,
    isGenerating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
