"use client";

import { ProposalFormProvider } from "@/features/proposals/context/ProposalFormContext";
import ProposalForm from "@/features/proposals/components/ProposalForm";

function CreateProposalPage() {
  return (
    <ProposalFormProvider>
      <ProposalForm />
    </ProposalFormProvider>
  );
}

export default CreateProposalPage;
