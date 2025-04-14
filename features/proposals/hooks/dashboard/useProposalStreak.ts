import { useQuery } from "@tanstack/react-query";
import { calculateProposalStreak } from "../../actions";

/**
 * Custom hook to fetch the user's proposal streak (consecutive days with proposals)
 * @returns Object with descriptively named properties for better readability
 */
export function useProposalStreak() {
  const query = useQuery({
    queryKey: ["proposalStreak"],
    queryFn: async () => {
      // Calculate the user's streak
      const streak = await calculateProposalStreak();

      return { streak };
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Return object with descriptive property names
  return {
    proposalStreak: query.data?.streak || 0,
    isLoadingProposalStreak: query.isLoading,
    isPendingProposalStreak: query.isPending,
    isProposalStreakError: query.isError,
    proposalStreakError: query.error,
    refetchProposalStreak: query.refetch,
    isProposalStreakFetching: query.isFetching,
    isProposalStreakSuccess: query.isSuccess,
    proposalStreakStatus: query.status,
  };
}

/**
 * Example usage in a component:
 *
 * const DashboardComponent = () => {
 *   const {
 *     proposalStreak,
 *     isLoadingProposalStreak,
 *     proposalStreakError
 *   } = useProposalStreak();
 *
 *   if (isLoadingProposalStreak) return <LoadingSpinner />;
 *   if (proposalStreakError) return <ErrorMessage message={proposalStreakError.message} />;
 *
 *   return (
 *     <div>
 *       <h2>Your current streak: {proposalStreak} days</h2>
 *       {proposalStreak > 0 && <p>Keep it up! Don't break your streak.</p>}
 *     </div>
 *   );
 * }
 */
