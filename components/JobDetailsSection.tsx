import React from "react";
import JobDescriptionForm from "./JobDescriptionForm";
import SkeletonLoader from "./SkeletonLoader";
import { useProposal } from "@/context/ProposalContext";

function JobDetailsSection() {
  const { isGenerating, isRefining } = useProposal();

  // Show loading state when generating or refining
  const isLoading = isGenerating || isRefining;

  return (
    <div className="w-full grid relative h-full">
      {isLoading ? (
        <div className="absolute inset-0 z-10">
          <SkeletonLoader
            height="h-full"
            width="w-full"
            text={
              isGenerating ? "Generating proposal..." : "Refining proposal..."
            }
            rounded="rounded-none"
          />
        </div>
      ) : (
        <JobDescriptionForm />
      )}
    </div>
  );
}

export default JobDetailsSection;
