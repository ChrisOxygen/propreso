import { useQuery } from "@tanstack/react-query";
import { getFilteredProposals } from "../actions";
import { ProposalStatus } from "@prisma/client";

/**
 * Custom hook for fetching filtered proposals with pagination and sorting
 *
 * @param {Object} options - Query parameters and options
 * @param {string} [options.search] - Search term to filter proposals
 * @param {ProposalStatus[]} [options.statuses=[]] - Array of statuses to filter by, empty array shows all
 * @param {string} [options.sortField="updatedAt"] - Field to sort by
 * @param {"asc"|"desc"} [options.sortDirection="desc"] - Sort direction
 * @param {number} [options.page=1] - Current page number
 * @param {number} [options.pageSize=10] - Items per page
 * @param {boolean} [options.enabled=true] - Whether the query should auto-execute
 * @returns {Object} Object containing proposals data, pagination and query state
 */
export function useFilteredProposals({
  search = "",
  statuses = [],
  sortField = "updatedAt",
  sortDirection = "desc",
  page = 1,
  pageSize = 10,
  enabled = true,
}: {
  search?: string;
  statuses?: ProposalStatus[];
  sortField?: string;
  sortDirection?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}) {
  const query = useQuery({
    queryKey: [
      "filteredProposals",
      search,
      statuses,
      sortField,
      sortDirection,
      page,
      pageSize,
    ],
    queryFn: () =>
      getFilteredProposals({
        search,
        statuses,
        sortField,
        sortDirection,
        page,
        pageSize,
      }),
    staleTime: 60 * 1000, // Data considered fresh for 1 minute
    enabled,
  });

  return {
    proposals: query.data?.proposals || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
