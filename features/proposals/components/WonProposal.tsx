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
          <Button onClick={handleViewAllProposals}>
            <List className="mr-2 h-4 w-4" />
            View All Proposals
          </Button>
          <Button onClick={handleCreateNewProposal}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Proposal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6 @container  w-full mx-auto ">
      {/* Job Title */}
      <div className="flex gap-5  px-5 w-full @[800px]:flex-row flex-col-reverse items-start @container @[800px]:items-center justify-between">
        <h3 className="text-2xl  font-bold">
          {proposal?.title || "Untitled Proposal"}
        </h3>
        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          <Button onClick={handleViewAllProposals} variant="outline">
            <List className="mr-2 h-4 w-4" />
            View All Proposals
          </Button>
          <Button
            onClick={handleCreateNewProposal}
            className=" flex gap-2 item-center"
          >
            <Plus className=" h-4 w-4" />
            <span className=" hidden @[1000px]:block">Create New Proposal</span>
          </Button>
        </div>
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
          <div className="text-gray-700">
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

export default WonProposal;
