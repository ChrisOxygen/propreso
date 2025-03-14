import React from "react";
import ProposalForm from "./ProposalForm";

function ProposalSection() {
  return (
    <div className=" grid grid-cols-[1fr_450px] h-full gap-4">
      <ProposalForm />
      <div className=""></div>
    </div>
  );
}

export default ProposalSection;
