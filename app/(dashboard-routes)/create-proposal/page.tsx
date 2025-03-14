"use client";

import JobDetailsSection from "@/components/JobDetailsSection";
import ProposalSection from "@/components/ProposalSection";

function CreateProposalPage() {
  // const { fetchStatusMessage, fetchStateStatus } = useCoverLetter();

  return (
    <main className=" h-full w-full grid grid-rows-[60px_1fr]">
      <div className=""></div>
      <div className=" grid grid-cols-[300px_1fr] w-full gap-2 h-full border-t p-2">
        <JobDetailsSection />
        <div className=" w-full h-full">
          <ProposalSection />
        </div>
      </div>
    </main>
  );
}

export default CreateProposalPage;
