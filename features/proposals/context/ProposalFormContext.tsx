"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useGenerateJobTitle } from "../hooks/useGenerateJobTitle";
import { useSaveOrUpdateProposal } from "../hooks/useSaveOrUpdateProposal";
import { GenerateProposalWithAIParams } from "../actions";
import { ProposalStatus } from "@prisma/client";
import { useGenerateProposalWithAI } from "../hooks/useGenerateProposalWithAI";
import { useRefineProposalWithAI } from "../hooks/useRefineProposalWithAI";
import {
  ProposalFormAction,
  ProposalFormContextType,
  ProposalFormState,
} from "../types";

// Initial state for creation - REMOVED loading states
const initialState: ProposalFormState = {
  jobDescription: "",
  proposal: "",
  proposalTitle: "",
  formula: "aida",
  tone: "professional",
  includePortfolio: false,
  isProposalRefined: false,
  error: null,
  proposalId: undefined,
  proposalStatus: null,
};

// Reducer function for creation - REMOVED loading state cases
function proposalFormReducer(
  state: ProposalFormState,
  action: ProposalFormAction
): ProposalFormState {
  switch (action.type) {
    case "SET_JOB_DESCRIPTION":
      return { ...state, jobDescription: action.payload };

    case "SET_PROPOSAL":
      const isDifferentFromCurrent =
        state.proposal && action.payload !== state.proposal;

      return {
        ...state,
        proposal: action.payload,
        isProposalRefined: isDifferentFromCurrent
          ? true
          : state.isProposalRefined,
      };

    case "SET_PROPOSAL_TITLE":
      return { ...state, proposalTitle: action.payload };

    case "SET_FORMULA":
      return { ...state, formula: action.payload };

    case "SET_TONE":
      return { ...state, tone: action.payload };

    case "SET_INCLUDE_PORTFOLIO":
      return { ...state, includePortfolio: action.payload };

    case "UPDATE_WITH_REFINED_PROPOSAL":
      return {
        ...state,
        proposal: action.payload,
        isProposalRefined: true,
        error: null,
      };

    case "SET_PROPOSAL_REFINED":
      return { ...state, isProposalRefined: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_PROPOSAL_ID":
      return { ...state, proposalId: action.payload };

    case "RESET_FORM":
      return { ...initialState };

    case "SET_PROPOSAL_STATUS":
      return { ...state, proposalStatus: action.payload };

    default:
      return state;
  }
}

const ProposalFormContext = createContext<ProposalFormContextType | undefined>(
  undefined
);

export function ProposalFormProvider({
  children,
  editProposalInitialState = null,
}: {
  children: ReactNode;
  editProposalInitialState?: ProposalFormState | null;
}) {
  const [state, dispatch] = useReducer(
    proposalFormReducer,
    editProposalInitialState || initialState
  );

  // Job title generation
  const {
    generateTitle,
    generatedTitle,
    isGeneratingTitle,
    titleGenerationSuccessful,
    titleGenerationError,
    titleError,
  } = useGenerateJobTitle();

  // Proposal generation - Using hook state
  const { generateProposal: generateWithAI, isGenerating } =
    useGenerateProposalWithAI({
      onSuccess: (proposal) => {
        dispatch({ type: "SET_PROPOSAL", payload: proposal });
      },
      onError: (error) => {
        dispatch({ type: "SET_ERROR", payload: error });
      },
    });

  // Proposal refinement - Using hook state
  const { refineProposal: refineWithAI, isRefining } = useRefineProposalWithAI({
    onSuccess: (refinedProposal) => {
      dispatch({
        type: "UPDATE_WITH_REFINED_PROPOSAL",
        payload: refinedProposal,
      });
    },
    onError: (error) => {
      dispatch({ type: "SET_ERROR", payload: error });
    },
  });

  // Proposal saving
  const { saveProposal: saveOrUpdateProposal, isSaving } =
    useSaveOrUpdateProposal(state.proposalId, state.proposalStatus, {
      onSuccess: (proposal) => {
        dispatch({ type: "SET_PROPOSAL_ID", payload: proposal.id });
        if (proposal.status !== state.proposalStatus) {
          dispatch({ type: "SET_PROPOSAL_STATUS", payload: proposal.status });
        }
        // if status is SENT, redirect to the proposal page
        if (proposal.status === "SENT") {
          window.location.href = `/proposals/${proposal.id}`;
        }
      },
      onError: (error) => {
        dispatch({ type: "SET_ERROR", payload: error });
      },
    });

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

  // Action handlers using useCallback to prevent unnecessary re-renders
  const handleSetJobDescription = useCallback((description: string) => {
    dispatch({ type: "SET_JOB_DESCRIPTION", payload: description });
  }, []);

  const handleSetProposal = useCallback((proposal: string) => {
    dispatch({ type: "SET_PROPOSAL", payload: proposal });
  }, []);

  const handleSetProposalTitle = useCallback((title: string) => {
    dispatch({ type: "SET_PROPOSAL_TITLE", payload: title });
  }, []);

  const handleSetFormula = useCallback((formula: string) => {
    dispatch({ type: "SET_FORMULA", payload: formula });
  }, []);

  const handleSetTone = useCallback((tone: string) => {
    dispatch({ type: "SET_TONE", payload: tone });
  }, []);

  const handleSetIncludePortfolio = useCallback((include: boolean) => {
    dispatch({ type: "SET_INCLUDE_PORTFOLIO", payload: include });
  }, []);

  const handleGenerateProposal = useCallback(() => {
    // Track if the proposal has been refined
    if (state.isProposalRefined) {
      dispatch({ type: "SET_PROPOSAL_REFINED", payload: false });
    }

    const params = {
      jobDescription: state.jobDescription,
      formula: state.formula,
      tone: state.tone,
      jobTitle: state.proposalTitle,
      addPortfolioSamples: state.includePortfolio,
    };
    generateWithAI(params as GenerateProposalWithAIParams);
  }, [generateWithAI, state]);

  const handleRefineProposal = useCallback(() => {
    refineWithAI(state.jobDescription, state.proposal);
  }, [refineWithAI, state.jobDescription, state.proposal]);

  const handleGenerateJobTitle = useCallback(() => {
    generateTitle({
      jobDescription: state.jobDescription,
    });
  }, [generateTitle, state.jobDescription]);

  const handleSaveProposal = useCallback(
    (status?: ProposalStatus) => {
      saveOrUpdateProposal({
        title: state.proposalTitle,
        jobDescription: state.jobDescription,
        proposal: state.proposal,
        amount: 0,
        status: status || state.proposalStatus || "DRAFT",
      });
    },
    [
      saveOrUpdateProposal,
      state.proposalTitle,
      state.jobDescription,
      state.proposal,
      state.proposalStatus,
    ]
  );

  const handleResetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
  }, []);

  return (
    <ProposalFormContext.Provider
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
        generateJobTitle: handleGenerateJobTitle,
        isGeneratingTitle,
        saveProposal: handleSaveProposal,
        resetForm: handleResetForm,
        isSaving,
        isGenerating, // From hook
        isRefining, // From hook,
      }}
    >
      {children}
    </ProposalFormContext.Provider>
  );
}

export function useProposalForm() {
  const context = useContext(ProposalFormContext);
  if (context === undefined) {
    throw new Error(
      "useProposalForm must be used within a ProposalFormProvider"
    );
  }
  return context;
}
