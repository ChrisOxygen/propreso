import React from "react";
import JobDescriptionForm from "../../../../components/JobDescriptionForm";
import SkeletonLoader from "../../../../components/SkeletonLoader";
import { useProposal } from "@/features/proposals/context/ProposalContext";

function JobDetailsSection() {
  const { isGenerating, isRefining } = useProposal();

  // Show loading state when generating or refining
  const isLoading = isGenerating || isRefining;

  return (
    <div className="w-full h-full relative">
      {/* Job details are only visible on larger screens */}
      <div className="w-full h-full">
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
    </div>
  );
}

export default JobDetailsSection;
