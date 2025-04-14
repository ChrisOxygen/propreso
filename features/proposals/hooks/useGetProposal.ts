import { useQuery } from "@tanstack/react-query";
import { getProposalById } from "../actions";

/**
 * Custom hook to fetch a single proposal by its ID
 * @param id The unique identifier of the proposal to fetch
 * @returns Object with descriptively named properties for better readability
 */
export function useGetProposal(id: string | undefined) {
  const query = useQuery({
    queryKey: ["proposal", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Proposal ID is required");
      }

      const response = await getProposalById(id);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch proposal");
      }

      return {
        proposal: response.proposal,
      };
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    enabled: !!id, // Only run the query if we have an ID
  });

  // Return object with descriptive property names
  return {
    proposal: query.data?.proposal,
    isLoadingProposal: query.isLoading,
    isPendingProposal: query.isPending,
    isProposalError: query.isError,
    proposalError: query.error,
    refetchProposal: query.refetch,
    isProposalFetching: query.isFetching,
    isProposalSuccess: query.isSuccess,
    proposalStatus: query.status,
  };
}
