"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { useMutation } from "@tanstack/react-query";
import {
  generateProposalWithAI,
  GenerateProposalWithAIParams,
} from "../actions";
import { useGenerateJobTitle } from "../hooks/useGenerateJobTitle";
import { useProposalMutation } from "../hooks/useProposalMutation";

// Define the state type
interface ProposalState {
  jobDescription: string;
  proposal: string;
  proposalTitle: string;
  formula: string;
  tone: string;
  includePortfolio: boolean;
  isGenerating: boolean;
  isRefining: boolean;
  isProposalRefined: boolean;
  isSaving: boolean;
  error: Error | null;
  proposalId?: string;
}

// Define action types
type ProposalAction =
  | { type: "SET_JOB_DESCRIPTION"; payload: string }
  | { type: "SET_PROPOSAL"; payload: string }
  | { type: "SET_PROPOSAL_TITLE"; payload: string }
  | { type: "SET_FORMULA"; payload: string }
  | { type: "SET_TONE"; payload: string }
  | { type: "SET_INCLUDE_PORTFOLIO"; payload: boolean }
  | { type: "SET_IS_GENERATING"; payload: boolean }
  | { type: "SET_PROPOSAL_SUCCESS"; payload: string }
  | { type: "SET_ERROR"; payload: Error | null }
  | { type: "SET_IS_REFINING"; payload: boolean }
  | { type: "SET_REFINED_PROPOSAL_SUCCESS"; payload: string }
  | { type: "SET_PROPOSAL_REFINED"; payload: boolean }
  | { type: "SET_IS_SAVING"; payload: boolean }
  | { type: "SET_PROPOSAL_ID"; payload: string };

// Initial state
const initialState: ProposalState = {
  jobDescription: "",
  proposal: "",
  proposalTitle: "",
  formula: "aida",
  tone: "professional",
  includePortfolio: false,
  isGenerating: false,
  isRefining: false,
  isProposalRefined: false,
  isSaving: false,
  error: null,
};

// Reducer function
function proposalReducer(
  state: ProposalState,
  action: ProposalAction
): ProposalState {
  switch (action.type) {
    case "SET_JOB_DESCRIPTION":
      return { ...state, jobDescription: action.payload };

    case "SET_PROPOSAL":
      const isSignificantChange =
        state.proposal &&
        action.payload !== state.proposal &&
        Math.abs(action.payload.length - state.proposal.length) > 20;

      return {
        ...state,
        proposal: action.payload,
        isProposalRefined: isSignificantChange ? true : state.isProposalRefined,
      };

    case "SET_PROPOSAL_TITLE":
      return { ...state, proposalTitle: action.payload };

    case "SET_FORMULA":
      return { ...state, formula: action.payload };

    case "SET_TONE":
      return { ...state, tone: action.payload };

    case "SET_INCLUDE_PORTFOLIO":
      return { ...state, includePortfolio: action.payload };

    case "SET_IS_GENERATING":
      return {
        ...state,
        isGenerating: action.payload,
        ...(action.payload ? { isProposalRefined: false, error: null } : {}),
      };

    case "SET_PROPOSAL_SUCCESS":
      return {
        ...state,
        proposal: action.payload,
        isGenerating: false,
        error: null,
      };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_IS_REFINING":
      return {
        ...state,
        isRefining: action.payload,
        ...(action.payload ? { error: null } : {}),
      };

    case "SET_REFINED_PROPOSAL_SUCCESS":
      return {
        ...state,
        proposal: action.payload,
        isRefining: false,
        isProposalRefined: true,
        error: null,
      };

    case "SET_PROPOSAL_REFINED":
      return { ...state, isProposalRefined: action.payload };

    case "SET_IS_SAVING":
      return { ...state, isSaving: action.payload };

    case "SET_PROPOSAL_ID":
      return { ...state, proposalId: action.payload };

    default:
      return state;
  }
}

// Context type
interface ProposalContextType extends ProposalState {
  setJobDescription: (description: string) => void;
  setProposal: (proposal: string) => void;
  setProposalTitle: (title: string) => void;
  setFormula: (formula: string) => void;
  setTone: (tone: string) => void;
  setIncludePortfolio: (include: boolean) => void;
  generateProposal: () => void;
  refineProposal: () => void;
  saveProposal: (status?: "draft" | "sent") => void;
  generateJobTitle: () => void;
  isGeneratingTitle: boolean;
  setProposalId: (id: string) => void;
  isSavingOrUpdatingProposal: boolean;
}

const ProposalContext = createContext<ProposalContextType | undefined>(
  undefined
);

export function ProposalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(proposalReducer, initialState);

  const {
    generateTitle,
    generatedTitle,
    isGeneratingTitle,
    titleGenerationSuccessful,
    titleGenerationError,
    titleError,
  } = useGenerateJobTitle();

  const generateMutation = useMutation({
    mutationFn: generateProposalWithAI,
    onMutate: () => {
      dispatch({ type: "SET_IS_GENERATING", payload: true });
    },
    onSuccess: (data) => {
      dispatch({ type: "SET_PROPOSAL_SUCCESS", payload: data.proposal });
    },
    onError: (error: Error) => {
      console.error("Error generating proposal:", error);
      dispatch({ type: "SET_IS_GENERATING", payload: false });
      dispatch({ type: "SET_ERROR", payload: error });
    },
  });

  const refineMutation = useMutation({
    mutationFn: async () => {
      if (!state.jobDescription.trim() || !state.proposal.trim()) {
        throw new Error("Job description and proposal are required");
      }

      dispatch({ type: "SET_IS_REFINING", payload: true });

      const response = await fetch("/api/refine-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription: state.jobDescription,
          originalProposal: state.proposal,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refine proposal");
      }

      return response.json();
    },
    onSuccess: (data) => {
      dispatch({
        type: "SET_REFINED_PROPOSAL_SUCCESS",
        payload: data.refinedProposal,
      });
    },
    onError: (error: Error) => {
      console.error("Error refining proposal:", error);
      dispatch({ type: "SET_IS_REFINING", payload: false });
      dispatch({ type: "SET_ERROR", payload: error });
    },
  });

  const {
    mutate: saveOrUpdateProposal,
    data: savedProposalData,
    isPending: savingOrUpdatingProposal,
    isSuccess: successfullyProposalMutation,
  } = useProposalMutation(state.proposalId);

  // Update proposal title when generated
  useEffect(() => {
    if (titleGenerationSuccessful && generatedTitle) {
      dispatch({ type: "SET_PROPOSAL_TITLE", payload: generatedTitle.title });
    }
    if (titleGenerationError) {
      console.error("Error generating job title:", titleError);
      dispatch({ type: "SET_ERROR", payload: titleError });
    }
  }, [
    titleGenerationSuccessful,
    generatedTitle,
    titleGenerationError,
    titleError,
  ]);

  // Action handlers
  const handleSetJobDescription = (description: string) => {
    dispatch({ type: "SET_JOB_DESCRIPTION", payload: description });
  };

  const handleSetProposal = (proposal: string) => {
    dispatch({ type: "SET_PROPOSAL", payload: proposal });
  };

  const handleSetProposalTitle = (title: string) => {
    dispatch({ type: "SET_PROPOSAL_TITLE", payload: title });
  };

  const handleSetFormula = (formula: string) => {
    dispatch({ type: "SET_FORMULA", payload: formula });
  };

  const handleSetTone = (tone: string) => {
    dispatch({ type: "SET_TONE", payload: tone });
  };

  const handleSetIncludePortfolio = (include: boolean) => {
    dispatch({ type: "SET_INCLUDE_PORTFOLIO", payload: include });
  };

  const handleGenerateProposal = () => {
    generateMutation.mutate({
      jobDescription: state.jobDescription,
      formula: state.formula,
      tone: state.tone,
      jobTitle: state.proposalTitle,
      addPortfolioSamples: state.includePortfolio,
    } as GenerateProposalWithAIParams);
  };

  const handleRefineProposal = () => {
    refineMutation.mutate();
  };

  const handleGenerateJobTitle = () => {
    generateTitle({
      jobDescription: state.jobDescription,
    });
  };

  const handleSaveProposal = (status?: "draft" | "sent") => {
    saveOrUpdateProposal(
      {
        title: state.proposalTitle,
        jobDescription: state.jobDescription,
        proposal: state.proposal,
        amount: 0,
        status: status,
      } as {
        title: string;
        jobDescription: string;
        proposal: string;
        amount?: number;
        status?: "draft" | "sent";
      } // Adjust the type as per your API requirements
    );
  };

  if (successfullyProposalMutation && savedProposalData) {
    if (state.proposalId !== savedProposalData.proposal!.id) {
      dispatch({
        type: "SET_PROPOSAL_ID",
        payload: savedProposalData.proposal!.id,
      });
    }
  }

  return (
    <ProposalContext.Provider
      value={{
        ...state,
        setJobDescription: handleSetJobDescription,
        setProposal: handleSetProposal,
        setProposalTitle: handleSetProposalTitle,
        setFormula: handleSetFormula,
        setTone: handleSetTone,
        setIncludePortfolio: handleSetIncludePortfolio,
        generateProposal: handleGenerateProposal,
        refineProposal: handleRefineProposal,
        saveProposal: handleSaveProposal,
        generateJobTitle: handleGenerateJobTitle,
        isGeneratingTitle,
        setProposalId: (id: string) => {
          dispatch({ type: "SET_PROPOSAL_ID", payload: id });
        },
        isSavingOrUpdatingProposal: savingOrUpdatingProposal,
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
