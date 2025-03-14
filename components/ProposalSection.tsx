import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProposalForm from "./ProposalForm";
import SkeletonLoader from "./SkeletonLoader";
import { useJobDetailsQuery } from "@/hooks/cover-letter/useJobDetailsQuery";
import { useAnalizeJobDetails } from "@/hooks/cover-letter/useAnalizeJobDetails";
import { useProposal } from "@/context/ProposalContext";
import { flattenJobData } from "@/lib/services";

function ProposalSection() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobDetailsId");

  // Get the setJobDescription function from context
  const { setJobDescription } = useProposal();

  // Fetch job details if jobId is present
  const {
    data: jobDetails,
    isLoading: isJobDetailsLoading,
    error: jobDetailsError,
  } = useJobDetailsQuery(jobId || "", !!jobId);

  // Setup the analyze job details mutation
  const {
    analizeJobDetails,
    isAnalizing,
    analizeJobDetailsError,
    analizeJobDetailsSuccess,
    analizeJobDetailsApiResponse,
  } = useAnalizeJobDetails();

  // When job details are loaded, analyze them
  useEffect(() => {
    if (jobDetails && !isJobDetailsLoading) {
      const jobDetailsForAnalysis = {
        url: jobDetails.jobUrl,
        html: jobDetails.jobHtml,
      } as JobDetailsFromPlatform;
      analizeJobDetails(jobDetailsForAnalysis);
    }
  }, [jobDetails, isJobDetailsLoading, analizeJobDetails]);

  // When analysis is complete, update the job description in context
  useEffect(() => {
    if (analizeJobDetailsSuccess && analizeJobDetailsApiResponse) {
      // Extract the job description from the analyzed data

      const flattenedJobDetails = flattenJobData(analizeJobDetailsApiResponse);
      // each item in the flattenedJobDetails is an object. now convert flattenedJobDetails to string where  each item thats has key-value pair, key is the title and value is the description
      // e.g. "Title:
      // Description"

      const jobDescription = flattenedJobDetails.reduce((acc, item) => {
        const curr = Object.entries(item);

        return `${acc}${curr[0]}:\n${curr[1]}\n\n`;
      }, "");

      setJobDescription(jobDescription);
    }
  }, [
    analizeJobDetailsSuccess,
    analizeJobDetailsApiResponse,
    setJobDescription,
  ]);

  // Determine the loading state and message
  const isLoading = isJobDetailsLoading || isAnalizing;
  const loadingMessage = isJobDetailsLoading
    ? "Fetching job details..."
    : isAnalizing
    ? "Analyzing job details..."
    : "";

  // Determine if there's an error
  const hasError = jobDetailsError || analizeJobDetailsError;
  const errorMessage = jobDetailsError
    ? "Error fetching job details"
    : analizeJobDetailsError
    ? "Error analyzing job details"
    : "";

  return (
    <div className="grid grid-cols-[1fr_450px] h-full gap-4 relative">
      {isLoading ? (
        <div className="absolute inset-0 z-10">
          <SkeletonLoader
            text={loadingMessage}
            height="h-full"
            width="w-full"
            rounded="rounded-none"
            textSize="text-base"
          />
        </div>
      ) : (
        <ProposalForm />
      )}
      {hasError && (
        <div className="absolute inset-0 z-10 bg-red-50 bg-opacity-90 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-red-600 font-semibold">{errorMessage}</p>
            <p className="text-red-500 mt-2">
              Please try again or enter job details manually.
            </p>
          </div>
        </div>
      )}

      <div className=""></div>
    </div>
  );
}

export default ProposalSection;
