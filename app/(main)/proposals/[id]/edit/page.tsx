"use client";

import { useParams } from "next/navigation";

import { useGetProposal } from "@/features/proposals/hooks/useGetProposal";

import InBoxLoader from "@/components/InBoxLoader";
import { ProposalFormState } from "@/features/proposals/types";
import { ProposalFormProvider } from "@/features/proposals/context/ProposalFormContext";
import ProposalForm from "@/features/proposals/components/ProposalForm";

function EditProposalPage() {
  const params = useParams();
  const proposalId = typeof params?.id === "string" ? params.id : undefined;
  const { proposal, isPendingProposal } = useGetProposal(proposalId);

  if (isPendingProposal) {
    return <InBoxLoader />;
  }

  const initialState: ProposalFormState = {
    jobDescription: proposal?.jobDescription || "",
    proposal: proposal?.proposal || "",
    proposalTitle: proposal?.title || "",
    formula: "aida",
    tone: "professional",
    includePortfolio: false,
    isProposalRefined: false,
    error: null,
    proposalId: proposalId,
    proposalStatus: proposal?.status || null,
  };

  console.log("Proposal id:", proposalId);

  return (
    <ProposalFormProvider editProposalInitialState={initialState}>
      <ProposalForm />
    </ProposalFormProvider>
  );
}

export default EditProposalPage;
