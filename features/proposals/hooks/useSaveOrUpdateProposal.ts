import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProposal, updateProposal } from "../actions";
import { Proposal, ProposalStatus } from "@prisma/client";

// Type for the proposal data
type ProposalData = {
  title: string;
  jobDescription: string;
  proposal: string;
  amount?: number;
  status?: ProposalStatus;
};

interface UseSaveOrUpdateProposalProps {
  onMutate?: () => void;
  onSuccess?: (proposal: Proposal) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for creating or updating proposals using Tanstack Query
 *
 * @param id Optional proposal ID. If provided, the hook will update the existing proposal
 * @param options Optional callbacks for mutation lifecycle events
 * @returns Object with mutate function and status information
 */
export function useSaveOrUpdateProposal(
  id?: string,
  proposalStatus?: ProposalStatus | null,
  { onMutate, onSuccess, onError }: UseSaveOrUpdateProposalProps = {}
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // If id is provided, use updateProposal, otherwise use createProposal
    mutationFn: async (data: ProposalData) => {
      if (id) {
        // Update existing proposal
        if (!proposalStatus) {
          throw new Error(
            "Proposal status is required for updating a proposal"
          );
        }
        console.log("Updating proposal with ID:", id);
        console.log("Proposal status:", proposalStatus);
        console.log("Proposal data:", data);
        return updateProposal({
          id,
          ...data,
        });
      } else {
        // Create new proposal
        return createProposal(data);
      }
    },

    // Handle mutation start
    onMutate: () => {
      if (onMutate) onMutate();
    },

    // Handle success
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
        if (id) {
          queryClient.invalidateQueries({ queryKey: ["proposal", id] });
        }
      }

      // Execute the custom success callback
      if (onSuccess && data.proposal) onSuccess(data.proposal);
    },

    // Handle errors
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to process proposal",
      });

      // Execute the custom error callback
      if (onError) onError(error);
    },
  });

  // Provide a simple interface to the mutation
  const saveProposal = (data: ProposalData) => {
    mutation.mutate(data);
  };

  return {
    saveProposal,
    isSaving: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}
