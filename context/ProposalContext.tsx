"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProposalContextType {
  jobDescription: string;
  proposal: string;
  isGenerating: boolean;
  setJobDescription: (description: string) => void;
  setProposal: (proposal: string) => void;
  generateProposal: () => Promise<void>;
}

const ProposalContext = createContext<ProposalContextType | undefined>(
  undefined
);

export function ProposalProvider({ children }: { children: ReactNode }) {
  const [jobDescription, setJobDescription] = useState("");
  const [proposal, setProposal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Function to generate proposal based on job description
  const generateProposal = async () => {
    if (!jobDescription.trim()) {
      return;
    }

    setIsGenerating(true);
    try {
      // Mock API call - replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, we're just creating a simple proposal
      // Replace this with your actual AI-based proposal generation
      const generatedProposal = `Dear Hiring Manager,

I'm excited to apply for the position outlined in your job post. Based on your requirements, I believe I'm an excellent fit for this role.

[This is where the AI-generated proposal would be based on: "${jobDescription.substring(
        0,
        50
      )}..."]

I look forward to discussing how my skills and experience align with your needs.

Best regards,
[Your Name]`;

      setProposal(generatedProposal);
    } catch (error) {
      console.error("Error generating proposal:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ProposalContext.Provider
      value={{
        jobDescription,
        proposal,
        isGenerating,
        setJobDescription,
        setProposal,
        generateProposal,
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
