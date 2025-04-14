import { useQuery } from "@tanstack/react-query";
import { getSentProposalsCount } from "../../actions";

/**
 * Custom hook to fetch the count of proposals sent within a specific time period
 * @param period The time period to fetch count for ('week', 'month', or 'year')
 * @returns Object with descriptively named properties for better readability
 */
export function useSentProposalsCount(
  period: "week" | "month" | "year" = "month"
) {
  const query = useQuery({
    queryKey: ["sentProposalsCount", period],
    queryFn: async () => {
      const response = await getSentProposalsCount(period);

      if (!response.success) {
        throw new Error("Failed to fetch sent proposals count");
      }

      return {
        currentCount: response.currentCount,
        previousCount: response.previousCount,
        trendDirection: response.trend.trendDirection,
        trendPercentage: response.trend.trendPercentage,
        period: response.period,
      };
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Return object with descriptive property names
  return {
    currentProposalCount: query.data?.currentCount ?? 0,
    previousProposalCount: query.data?.previousCount ?? 0,
    trendDirection: query.data?.trendDirection ?? "neutral",
    trendPercentage: query.data?.trendPercentage ?? 0,
    currentPeriod: query.data?.period,
    isLoadingProposalCount: query.isLoading,
    isPendingProposalCount: query.isPending,
    isProposalCountError: query.isError,
    proposalCountError: query.error,
    refetchProposalCount: query.refetch,
    isProposalCountFetching: query.isFetching,
    isProposalCountSuccess: query.isSuccess,
    proposalCountStatus: query.status,
  };
}

/**
 * Example usage in a component:
 *
 * const DashboardComponent = () => {
 *   const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
 *   const {
 *     proposalCount,
 *     isLoadingProposalCount,
 *     proposalCountError
 *   } = useSentProposalsCount(period);
 *
 *   if (isLoadingProposalCount) return <LoadingSpinner />;
 *   if (proposalCountError) return <ErrorMessage message={proposalCountError.message} />;
 *
 *   return (
 *     <div>
 *       <h2>Proposals sent in the last {period}: {proposalCount}</h2>
 *       <PeriodSelector value={period} onChange={setPeriod} />
 *     </div>
 *   );
 * }
 */
