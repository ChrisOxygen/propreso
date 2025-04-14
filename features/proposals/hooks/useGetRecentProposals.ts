import { useQuery } from "@tanstack/react-query";
import { getRecentProposals } from "../actions";

/**
 * Custom hook to fetch the 5 most recent proposals
 */
export function useGetRecentProposals() {
  const query = useQuery({
    queryKey: ["recentProposals"],
    queryFn: async () => {
      const response = await getRecentProposals();

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch recent proposals");
      }

      return response.proposals;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  return {
    recentProposals: query.data || [],
    isLoadingRecentProposals: query.isLoading,
    isPendingRecentProposals: query.isPending,
    isRecentProposalsError: query.isError,
    recentProposalsError: query.error,
    refetchRecentProposals: query.refetch,
    isRecentProposalsFetching: query.isFetching,
    isRecentProposalsSuccess: query.isSuccess,
  };
}
