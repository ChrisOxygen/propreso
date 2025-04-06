import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { createProposal, updateProposal } from "../actions";

// Type for the proposal data
type ProposalData = {
  title: string;
  jobDescription: string;
  proposal: string;
  amount?: number;
  status?: string;
};

/**
 * Custom hook for creating or updating proposals using Tanstack Query
 *
 * @param id Optional proposal ID. If provided, the hook will update the existing proposal
 * @returns Mutation object with mutate function and status information
 */
export function useProposalMutation(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // If id is provided, use updateProposal, otherwise use createProposal
    mutationFn: async (data: ProposalData) => {
      if (id) {
        // Update existing proposal
        return updateProposal({
          id,
          ...data,
        });
      } else {
        // Create new proposal
        return createProposal(data);
      }
    },

    // Handle success and error scenarios
    onSuccess: (data) => {
      if (data.success) {
        // Show success toast
        toast.success(id ? "Proposal updated" : "Proposal created", {
          description: data.message,
        });

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
        if (id) {
          queryClient.invalidateQueries({ queryKey: ["proposal", id] });
        }
      } else {
        // If the server returned a failure status
        toast.error("Operation failed", { description: data.message });
      }
    },

    // Handle errors from the mutation itself
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to process proposal",
      });
    },
  });
}

/**
 * Usage example:
 *
 * // For creating a new proposal:
 * const { mutate: createProposal, isPending } = useProposalMutation();
 *
 * // Later in your code:
 * createProposal({
 *   title: 'Frontend Developer',
 *   jobDescription: 'Looking for a React expert...',
 *   proposal: 'I am excited to apply...'
 * });
 *
 * // For updating an existing proposal:
 * const { mutate: updateProposal, isPending } = useProposalMutation('proposal-id-123');
 *
 * // Later in your code:
 * updateProposal({
 *   title: 'Updated Title',
 *   proposal: 'Updated content...',
 *   // Only include fields you want to update
 * });
 */
