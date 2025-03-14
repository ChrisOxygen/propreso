import { useMutation } from "@tanstack/react-query";

export const useAnalizeJobDetails = () => {
  const {
    mutate: analizeJobDetails,
    isPending: isAnalizing,
    error: analizeJobDetailsError,
    isSuccess: analizeJobDetailsSuccess,
    data: analizeJobDetailsApiResponse,
  } = useMutation({
    mutationFn: async (details: JobDetailsFromPlatform) => {
      console.log("Analyzing job details:", details);

      // Make sure we have the HTML content
      if (!details.html) {
        throw new Error("HTML content is required for job analysis");
      }

      const response = await fetch("/api/analize-job-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data as AnalizedUpworkJobData;
    },
  });

  return {
    analizeJobDetails,
    isAnalizing,
    analizeJobDetailsError,
    analizeJobDetailsSuccess,
    analizeJobDetailsApiResponse,
  };
};
