import { useQuery } from "@tanstack/react-query";
import { getProposalChartData } from "../../actions";

/**
 * Custom hook to fetch proposal chart data organized by time periods
 * @param period The time period to fetch data for ('week', 'month', or 'year')
 * @returns Object with descriptively named properties for better readability
 */
export function useProposalChartData(
  period: "week" | "month" | "year" = "month"
) {
  const query = useQuery({
    queryKey: ["proposalChartData", period],
    queryFn: async () => {
      const response = await getProposalChartData(period);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch proposal chart data"
        );
      }

      return {
        chartData: response.chartData,
        period: response.period,
      };
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Return object with descriptive property names
  return {
    proposalChartData: query.data?.chartData || [],
    currentPeriod: query.data?.period,
    isLoadingChartData: query.isLoading,
    isPendingChartData: query.isPending,
    isChartDataError: query.isError,
    chartDataError: query.error,
    refetchChartData: query.refetch,
    isChartDataFetching: query.isFetching,
    isChartDataSuccess: query.isSuccess,
    chartDataStatus: query.status,
  };
}
