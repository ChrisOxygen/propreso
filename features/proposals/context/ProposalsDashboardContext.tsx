"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useProposalStreak } from "../hooks/dashboard/useProposalStreak";
import { useSentProposalsCount } from "../hooks/dashboard/useSentProposalsCount";
import { useProposalChartData } from "../hooks/dashboard/useProposalChartData";
import { useWinRate } from "../hooks/dashboard/useWinRate";
import { useGetRecentProposals } from "../hooks/useGetRecentProposals";
import { Period, ProposalDashboardState } from "../types";

// Create context with default/empty values
const ProposalDashboardContext = createContext<
  ProposalDashboardState | undefined
>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const ProposalDashboardProvider = ({ children }: ProviderProps) => {
  // State for period selector
  const [period, setPeriod] = useState<Period>("week");
  const [error, setError] = useState<Error | null>(null);

  // Use our custom hooks with real data
  const { proposalStreak, isPendingProposalStreak } = useProposalStreak();

  // Get recent proposals using the new hook
  const {
    recentProposals,
    isPendingRecentProposals,
    isRecentProposalsError,
    recentProposalsError,
  } = useGetRecentProposals();

  // Update error state if there's an error from the hook
  if (isRecentProposalsError && recentProposalsError) {
    setError(recentProposalsError);
  }

  // Get sent proposals count with trend data
  const {
    currentProposalCount,
    previousProposalCount,
    trendDirection: sentTrendDirection,
    trendPercentage: sentTrendPercentage,
    isPendingProposalCount,
  } = useSentProposalsCount(period);

  // Get win rate data directly from the hook
  const {
    winRate,
    trendDirection: winRateTrendDirection,
    trendPercentage: winRateTrendPercentage,
    isLoadingWinRate,
  } = useWinRate(period);

  // Get chart data
  const { proposalChartData, isLoadingChartData } =
    useProposalChartData(period);

  // Determine if any data is loading
  const isLoading =
    isPendingProposalStreak ||
    isPendingProposalCount ||
    isLoadingWinRate ||
    isLoadingChartData ||
    isPendingRecentProposals;

  // Value to provide through context
  const value: ProposalDashboardState = {
    currentStreak: proposalStreak || 0,
    proposalsSent: currentProposalCount || 0,
    previousProposalsSent: previousProposalCount || 0,
    sentProposalsTrend: {
      direction: sentTrendDirection as "up" | "down" | "neutral",
      percentage: sentTrendPercentage,
    },
    winRate: winRate || "0%",
    winRateTrend: {
      direction: winRateTrendDirection as "up" | "down" | "neutral",
      percentage: winRateTrendPercentage,
    },
    chartData: proposalChartData || [],
    recentProposals,
    period,
    setPeriod,
    isLoading,
    error,
  };

  return (
    <ProposalDashboardContext.Provider value={value}>
      {children}
    </ProposalDashboardContext.Provider>
  );
};

/**
 * Custom hook to access the proposal dashboard data
 * @returns Proposal dashboard state including metrics, chart data, and recent proposals
 */
export const useProposalDashboard = (): ProposalDashboardState => {
  const context = useContext(ProposalDashboardContext);

  if (context === undefined) {
    throw new Error(
      "useProposalDashboard must be used within a ProposalDashboardProvider"
    );
  }

  return context;
};
