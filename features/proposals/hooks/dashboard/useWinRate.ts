import { useQuery } from "@tanstack/react-query";
import { getProposalWinRate } from "../../actions";

/**
 * Custom hook to fetch proposal win rate data for a specific time period
 * @param period The time period to analyze ('week', 'month', or 'year')
 * @returns Object with win rate data and query state properties
 */
export function useWinRate(period: "week" | "month" | "year" = "month") {
  const query = useQuery({
    queryKey: ["proposalWinRate", period],
    queryFn: async () => {
      const response = await getProposalWinRate(period);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch proposal win rate"
        );
      }

      return {
        winRate: response.winRate,
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
    winRate: query.data?.winRate ?? "0%",
    trendDirection: query.data?.trendDirection ?? "neutral",
    trendPercentage: query.data?.trendPercentage ?? 0,
    currentPeriod: query.data?.period,
    isLoadingWinRate: query.isLoading,
    isPendingWinRate: query.isPending,
    isWinRateError: query.isError,
    winRateError: query.error,
    refetchWinRate: query.refetch,
    isWinRateFetching: query.isFetching,
    isWinRateSuccess: query.isSuccess,
    winRateStatus: query.status,
  };
}

/**
 * Example usage in a component:
 *
 * const DashboardComponent = () => {
 *   const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
 *   const {
 *     winRate,
 *     trendDirection,
 *     trendPercentage,
 *     isLoadingWinRate
 *   } = useWinRate(period);
 *
 *   if (isLoadingWinRate) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       <h2>Win Rate: {winRate}</h2>
 *       <TrendIndicator direction={trendDirection} percentage={trendPercentage} />
 *       <PeriodSelector value={period} onChange={setPeriod} />
 *     </div>
 *   );
 * }
 */
