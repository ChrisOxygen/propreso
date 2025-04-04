"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import JobDetailsSection from "@/features/proposals/components/create-proposal/JobDetailsSection";
import ProposalSection from "@/features/proposals/components/create-proposal/ProposalSection";
import { ProposalProvider } from "@/features/proposals/context/ProposalContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function CreateProposalPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobDetailsId");
  const [viewMode, setViewMode] = useState<"job" | "proposal">("proposal");

  // Log the jobId for debugging purposes
  useEffect(() => {
    if (jobId) {
      console.log(`Job ID detected in URL: ${jobId}`);
    }
  }, [jobId]);

  // For mobile/tablet, we'll add a toggle to switch between job details and proposal
  const toggleView = () => {
    setViewMode(viewMode === "job" ? "proposal" : "job");
  };

  return (
    <main className="h-full w-full grid grid-rows-[60px_1fr]">
      <div className="flex items-center justify-between px-6 border-b">
        <h1 className="text-xl font-bold">Proposal Generator</h1>
        {jobId && (
          <span className="ml-4 text-sm text-gray-500 hidden lg:inline-block">
            Job ID: {jobId}
          </span>
        )}

        {/* Mobile/tablet toggle button */}
        <Button
          variant="outline"
          onClick={toggleView}
          className="lg:hidden flex items-center gap-1"
        >
          {viewMode === "proposal" ? (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Job Details</span>
            </>
          ) : (
            <>
              <span>Proposal</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <ProposalProvider>
        {/* Desktop View - Grid layout */}
        <div className="hidden lg:grid lg:grid-cols-[300px_1fr] w-full gap-2 h-full border-t p-2">
          <JobDetailsSection />
          <div className="w-full h-full">
            <ProposalSection />
          </div>
        </div>

        {/* Mobile/Tablet View - Conditional rendering based on toggle */}
        <div className="lg:hidden w-full h-full border-t p-2">
          {viewMode === "job" ? <JobDetailsSection /> : <ProposalSection />}
        </div>
      </ProposalProvider>
    </main>
  );
}

export default CreateProposalPage;
