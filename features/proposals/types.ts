import { Proposal, ProposalStatus } from "@prisma/client";

export type Period = "week" | "month" | "year";

export interface RateComparison {
  current: number;
  previous: number;
  percentageChange: number;
  direction: "up" | "down" | "neutral";
}

export interface ProposalChartItem {
  status: string;
  count: number;
}

export interface RecentProposal {
  id: string;
  title: string;
  status: string;
  amount: number | null;
  createdAt: Date;
}

export interface ProposalDashboardState {
  currentStreak: number;
  proposalsSent: number;
  previousProposalsSent: number;
  sentProposalsTrend: {
    direction: "up" | "down" | "neutral";
    percentage: number;
  };
  winRate: string;
  winRateTrend: {
    direction: "up" | "down" | "neutral";
    percentage: number;
  };
  chartData: Array<{
    periodTitle: string;
    DRAFT: number;
    SENT: number;
    WON: number;
  }>;
  recentProposals: Proposal[];
  period: Period;
  setPeriod: (period: Period) => void;
  isLoading: boolean;
  error: Error | null;
}

export interface ProposalFormState {
  jobDescription: string;
  proposalTitle: string;
  formula: string;
  tone: string;
  includePortfolio: boolean;
  proposal: string;
  isProposalRefined: boolean;
  error: Error | null;
  proposalId?: string;
  proposalStatus: ProposalStatus | null;
}

export type ProposalFormAction =
  | { type: "SET_JOB_DESCRIPTION"; payload: string }
  | { type: "SET_PROPOSAL"; payload: string }
  | { type: "SET_PROPOSAL_TITLE"; payload: string }
  | { type: "SET_FORMULA"; payload: string }
  | { type: "SET_TONE"; payload: string }
  | { type: "SET_INCLUDE_PORTFOLIO"; payload: boolean }
  | { type: "UPDATE_WITH_REFINED_PROPOSAL"; payload: string }
  | { type: "SET_PROPOSAL_REFINED"; payload: boolean }
  | { type: "SET_ERROR"; payload: Error | null }
  | { type: "SET_PROPOSAL_ID"; payload: string }
  | { type: "RESET_FORM" }
  | { type: "SET_PROPOSAL_STATUS"; payload: ProposalStatus | null };

export interface ProposalFormContextType extends ProposalFormState {
  setJobDescription: (description: string) => void;
  setProposal: (proposal: string) => void;
  setProposalTitle: (title: string) => void;
  setFormula: (formula: string) => void;
  setTone: (tone: string) => void;
  setIncludePortfolio: (include: boolean) => void;
  generateProposal: () => void;
  refineProposal: () => void;
  generateJobTitle: () => void;
  isGeneratingTitle: boolean;
  saveProposal: (status?: ProposalStatus) => void;
  resetForm: () => void;
  isSaving: boolean;
  isGenerating: boolean; // From hook
  isRefining: boolean; // From hook
}
