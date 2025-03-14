"use client";

import JobDetailsSection from "@/components/JobDetailsSection";
import ProposalSection from "@/components/ProposalSection";
import { ProposalProvider } from "@/context/ProposalContext";

function CreateProposalPage() {
  return (
    <main className="h-full w-full grid grid-rows-[60px_1fr]">
      <div className="flex items-center px-6 border-b">
        <h1 className="text-xl font-bold">Proposal Generator</h1>
      </div>
      <ProposalProvider>
        <div className="grid grid-cols-[300px_1fr] w-full gap-2 h-full border-t p-2">
          <JobDetailsSection />
          <div className="w-full h-full">
            <ProposalSection />
          </div>
        </div>
      </ProposalProvider>
    </main>
  );
}

export default CreateProposalPage;
