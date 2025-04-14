"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetProposal } from "@/features/proposals/hooks/useGetProposal";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/features/proposals/utils";
import { UpdateProposalStatusButton } from "@/features/proposals/components/UpdateProposalStatusButton";
import { ProposalActions } from "@/features/proposals/components/ProposalActions";

function ProposalPage() {
  const params = useParams();
  const proposalId = typeof params?.id === "string" ? params.id : undefined;

  // Fetch the proposal
  const { proposal, isPendingProposal, isProposalSuccess } =
    useGetProposal(proposalId);

  // State to track if job description is expanded
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Create a truncated version of the job description
  const truncatedDescription = proposal?.jobDescription
    ? proposal.jobDescription.slice(0, 200) +
      (proposal.jobDescription.length > 200 ? "..." : "")
    : "";

  if (isPendingProposal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!proposal && isProposalSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h2 className="text-2xl font-bold">Proposal not found</h2>
        <div className="flex gap-4">
          <ProposalActions />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6  w-full mx-auto ">
      {/* Job Title */}
      <div className="flex gap-5  px-5 w-full  flex-col items-start @container justify-between">
        <div className="flex gap-4  w-full justify-between border-y py-5 mt-4">
          <div className="">
            <Badge
              className={`${getStatusColor(
                proposal!.status
              )} flex items-center gap-2 h-full`}
            >
              <span className="w-2 h-2 rounded-full bg-white opacity-70"></span>
              {proposal?.status}
            </Badge>
          </div>
          <div className="flex items-center gap-5">
            {proposal && proposal.status !== "WON" && (
              <UpdateProposalStatusButton proposal={proposal} />
            )}
            <ProposalActions
              proposalId={proposalId}
              proposalStatus={proposal?.status}
            />
          </div>
        </div>
        <h3 className="text-2xl shrink-0 font-bold">
          {proposal?.title || "Untitled Proposal"}
        </h3>
      </div>

      {/* Job Description */}
      <Card className="border-none shadow-none relative bg-gray-100">
        <CardHeader className="pb-2 flex flex-row w-full items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            <h3> Job Description</h3>
          </CardTitle>
          {proposal?.jobDescription && proposal.jobDescription.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              className=""
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              {isDescriptionExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  View More
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {isDescriptionExpanded
              ? proposal?.jobDescription
              : truncatedDescription}
          </div>
        </CardContent>
      </Card>

      {/* Proposal Content */}
      <Card className="border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            <h3>Proposal</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-700 whitespace-pre-wrap">
            {proposal?.proposal || "No proposal content available."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProposalPage;
