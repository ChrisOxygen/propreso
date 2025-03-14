"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";

interface ProposalContextType {
  jobDescription: string;
  proposal: string;
  isGenerating: boolean;
  isRefining: boolean;
  setJobDescription: (description: string) => void;
  setProposal: (proposal: string) => void;
  generateProposal: () => void;
  refineProposal: () => void;
  error: Error | null;
}

const ProposalContext = createContext<ProposalContextType | undefined>(
  undefined
);

export function ProposalProvider({ children }: { children: ReactNode }) {
  const [jobDescription, setJobDescription] = useState("");
  const [proposal, setProposal] = useState("");
  const [error, setError] = useState<Error | null>(null);

  // Generate proposal mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!jobDescription.trim()) {
        throw new Error("Job description is required");
      }

      const response = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
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

  // Refine proposal mutation
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

  return (
    <ProposalContext.Provider
      value={{
        jobDescription,
        proposal,
        isGenerating: generateMutation.isPending,
        isRefining: refineMutation.isPending,
        setJobDescription,
        setProposal,
        generateProposal: generateMutation.mutate,
        refineProposal: refineMutation.mutate,
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
