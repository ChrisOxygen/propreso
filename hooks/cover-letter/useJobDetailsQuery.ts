import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch job details from the API
 *
 */
export const useJobDetailsQuery = (
  jobId: string,
  fetchStateStatus: FetchStateStatusType
) => {
  return useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: async () => {
      const response = await fetch(`/api/ex/job-details/${jobId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch job details");
      }
      return response.json();
    },

    enabled: fetchStateStatus === "fetchJobDetails" && !!jobId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};
