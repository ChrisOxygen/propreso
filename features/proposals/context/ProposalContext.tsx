"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { ProposalOptions } from "@/features/proposals/components/create-proposal/ProposalFormDialog";

interface ProposalContextType {
  jobDescription: string;
  proposal: string;
  isGenerating: boolean;
  isRefining: boolean;
  isProposalRefined: boolean;
  setJobDescription: (description: string) => void;
  setProposal: (proposal: string) => void;
  generateProposal: (options?: ProposalOptions) => void;
  refineProposal: () => void;
  setIsProposalRefined: (isRefined: boolean) => void;
  error: Error | null;
}

const ProposalContext = createContext<ProposalContextType | undefined>(
  undefined
);

export function ProposalProvider({ children }: { children: ReactNode }) {
  const [jobDescription, setJobDescription] = useState("");
  const [proposal, setProposal] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [isProposalRefined, setIsProposalRefined] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async (options?: ProposalOptions) => {
      if (!jobDescription.trim()) {
        throw new Error("Job description is required");
      }

      const response = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
          formula: options?.formula || "aida",
          tone: options?.tone || "professional",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate proposal");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setProposal(data.proposal);
      setError(null);
    },
    onError: (error: Error) => {
      console.error("Error generating proposal:", error);
      setError(error);
    },
  });

  const refineMutation = useMutation({
    mutationFn: async () => {
      if (!jobDescription.trim() || !proposal.trim()) {
        throw new Error("Job description and proposal are required");
      }

      const response = await fetch("/api/refine-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
          originalProposal: proposal,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refine proposal");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setProposal(data.refinedProposal);
      setError(null);
    },
    onError: (error: Error) => {
      console.error("Error refining proposal:", error);
      setError(error);
    },
  });

  // Reset refined state when generating a new proposal
  const handleGenerateProposal = (options?: ProposalOptions) => {
    setIsProposalRefined(false);
    generateMutation.mutate(options);
  };

  // Mark proposal as refined when refinement is successful
  const handleRefineProposal = () => {
    refineMutation.mutate(undefined, {
      onSuccess: () => {
        setIsProposalRefined(true);
      },
    });
  };

  // Mark proposal as refined when it's manually edited
  const handleSetProposal = (newProposal: string) => {
    if (
      proposal &&
      newProposal !== proposal &&
      Math.abs(newProposal.length - proposal.length) > 20
    ) {
      setIsProposalRefined(true);
    }
    setProposal(newProposal);
  };

  return (
    <ProposalContext.Provider
      value={{
        jobDescription,
        proposal,
        isGenerating: generateMutation.isPending,
        isRefining: refineMutation.isPending,
        isProposalRefined,
        setJobDescription,
        setProposal: handleSetProposal,
        generateProposal: handleGenerateProposal,
        refineProposal: handleRefineProposal,
        setIsProposalRefined,
        error,
      }}
    >
      {children}
    </ProposalContext.Provider>
  );
}

export function useProposal() {
  const context = useContext(ProposalContext);
  if (context === undefined) {
    throw new Error("useProposal must be used within a ProposalProvider");
  }
  return context;
}
