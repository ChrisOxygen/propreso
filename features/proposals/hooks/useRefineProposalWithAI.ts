import { useMutation } from "@tanstack/react-query";

interface RefineProposalParams {
  jobDescription: string;
  originalProposal: string;
}

interface UseRefineProposalWithAIProps {
  onMutate?: () => void;
  onSuccess?: (refinedProposal: string) => void;
  onError?: (error: Error) => void;
}

export function useRefineProposalWithAI({
  onMutate,
  onSuccess,
  onError,
}: UseRefineProposalWithAIProps = {}) {
  const mutation = useMutation({
    mutationFn: async (params: RefineProposalParams) => {
      const { jobDescription, originalProposal } = params;

      if (!jobDescription.trim() || !originalProposal.trim()) {
        throw new Error("Job description and proposal are required");
      }

      const response = await fetch("/api/refine-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
          originalProposal,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refine proposal");
      }

      return response.json();
    },
    onMutate: () => {
      if (onMutate) onMutate();
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data.refinedProposal);
    },
    onError: (error: Error) => {
      console.error("Error refining proposal:", error);
      if (onError) onError(error);
    },
  });

  const refineProposal = (jobDescription: string, originalProposal: string) => {
    mutation.mutate({ jobDescription, originalProposal });
  };

  return {
    refineProposal,
    isRefining: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
