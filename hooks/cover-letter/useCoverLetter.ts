"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useJobDetailsQuery } from "./useJobDetailsQuery";
import { useAnalizeJobDetails } from "./useAnalizeJobDetails";
import { flattenJobData } from "@/lib/services";

/**
 * Custom hook to fetch job details from the API
 *
 */

export const useCoverLetter = () => {
  const [jobDetails, setJobDetails] = useState<JobDetailsFromPlatform | null>(
    null
  );

  const [analizedJobDetail, setAnalizedJobDetail] = useState<
    null | FlattenedItem[]
  >(null);

  const searchParams = useSearchParams();

  const jobDetailsId = searchParams.get("jobDetailsId");

  const [fetchStateStatus, setFetchStateStatus] =
    useState<FetchStateStatusType>(() => {
      if (jobDetailsId) {
        return "fetchJobDetails";
      }
      return null;
    });

  const {
    data,
    isSuccess: useJobDetailsSuccess,
    error: useJobDetailsError,
    isPending: useJobDetailsPending,
  } = useJobDetailsQuery(jobDetailsId!, fetchStateStatus);

  const {
    analizeJobDetails,
    isAnalizing,
    analizeJobDetailsError,
    analizeJobDetailsSuccess,
    analizeJobDetailsApiResponse,
  } = useAnalizeJobDetails();

  if (useJobDetailsError || analizeJobDetailsError) {
    setFetchStateStatus("error");
  }

  if (useJobDetailsSuccess && data && fetchStateStatus === "fetchJobDetails") {
    const jobDetailsFromServer = {
      url: data.jobUrl,
      html: data.jobHtml,
      timestamp: data.timestamp,
    };
    setJobDetails(jobDetailsFromServer);
    setFetchStateStatus("analizingJobDetails");
    analizeJobDetails(jobDetails!);
  }

  if (analizeJobDetailsSuccess && analizeJobDetailsApiResponse) {
    const flattenedJobData = flattenJobData(analizeJobDetailsApiResponse);
    setAnalizedJobDetail(flattenedJobData);
    setFetchStateStatus("generatingProposal");
  }

  const fetchStatusMessage = () => {
    switch (fetchStateStatus) {
      case "fetchJobDetails":
        return "Fetching job details";
      case "analizingJobDetails":
        return "Analizing job details";
      case "generatingProposal":
        return "Generating proposal";
      case "ready":
        return "Ready";
      default:
        return "Unknown";
    }
  };
  return {
    jobDetails,
    analizedJobDetail,
    fetchStateStatus,
    useJobDetailsSuccess,
    useJobDetailsError,
    useJobDetailsPending,
    isAnalizing,
    analizeJobDetailsError,
    analizeJobDetailsSuccess,
    analizeJobDetailsApiResponse,
    fetchStatusMessage,
  };
};
