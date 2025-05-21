"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetProposal } from "../hooks/useGetProposal";
import { Button } from "@/components/ui/button";
import { Plus, List, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function WonProposal() {
  const params = useParams();
  const router = useRouter();
  const proposalId = typeof params?.id === "string" ? params.id : undefined;

  // Fetch the proposal
  const { proposal, isPendingProposal, isProposalSuccess } =
    useGetProposal(proposalId);

  // State to track if job description is expanded
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Handle view all proposals
  const handleViewAllProposals = () => {
    router.push("/proposals");
  };

  // Handle create new proposal
  const handleCreateNewProposal = () => {
    router.push("/proposals/create");
  };

  // Create a truncated version of the job description
  const truncatedDescription = proposal?.jobDescription
    ? proposal.jobDescription.slice(0, 200) +
      (proposal.jobDescription.length > 200 ? "..." : "")
    : "";

  if (isPendingProposal) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#BF4008]" />
      </div>
    );
  }

  if (!proposal && isProposalSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
        <h2 className="font-[Poppins] text-2xl font-bold tracking-[-0.72px] text-[#2C2C2C]">
          Proposal not found
        </h2>
        <div className="flex gap-4">
          <Button
            onClick={handleViewAllProposals}
            variant="outline"
            className="font-[Lato] font-medium"
          >
            <List className="mr-2 h-4 w-4" />
            View All Proposals
          </Button>
          <Button
            onClick={handleCreateNewProposal}
            className="bg-[#BF4008] font-[Lato] font-medium text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Proposal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="@container mx-auto flex w-full flex-col gap-6 py-6">
      {/* Job Title */}
      <div className="@container flex w-full flex-col-reverse items-start justify-between gap-5 px-5 @[800px]:flex-row @[800px]:items-center">
        <h3 className="font-[Poppins] text-2xl font-bold tracking-[-0.72px] text-[#2C2C2C]">
          {proposal?.title || "Untitled Proposal"}
        </h3>
        {/* Action Buttons */}
        <div className="mt-4 flex gap-4">
          <Button
            onClick={handleViewAllProposals}
            variant="outline"
            className="font-[Lato] font-medium"
          >
            <List className="mr-2 h-4 w-4" />
            View All Proposals
          </Button>
          <Button
            onClick={handleCreateNewProposal}
            className="flex items-center gap-2 bg-[#BF4008] font-[Lato] font-medium text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden @[1000px]:block">Create New Proposal</span>
          </Button>
        </div>
      </div>

      {/* Job Description */}
      <Card className="relative rounded-xl border-none bg-black/4 shadow-none">
        <CardHeader className="flex w-full flex-row items-center justify-between pb-2">
          <CardTitle className="font-[Poppins] text-lg font-semibold tracking-[-0.4px] text-[#2C2C2C]">
            <h3>Job Description</h3>
          </CardTitle>
          {proposal?.jobDescription && proposal.jobDescription.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              className="font-[Lato] text-[#404040] transition-colors duration-200 hover:text-[#BF4008]"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              {isDescriptionExpanded ? (
                <>
                  <ChevronUp className="mr-1 h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-4 w-4" />
                  View More
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="font-[Lato] tracking-[0.08px] text-[#404040]">
            {isDescriptionExpanded
              ? proposal?.jobDescription
              : truncatedDescription}
          </div>
        </CardContent>
      </Card>

      {/* Proposal Content */}
      <Card className="border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="font-[Poppins] text-lg font-semibold tracking-[-0.4px] text-[#2C2C2C]">
            <h3>Proposal</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-[Lato] tracking-[0.08px] whitespace-pre-wrap text-[#404040]">
            {proposal?.proposal || "No proposal content available."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WonProposal;
