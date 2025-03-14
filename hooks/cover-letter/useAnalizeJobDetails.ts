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
      console.log("function in services------ analizingJobDetails", details);
      const response = await fetch("/api/analize-job-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
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
