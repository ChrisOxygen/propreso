export interface ProposalDataItem {
  name: string;
  value: number;
  color: string;
}

export interface WeeklyDataItem {
  week: string;
  sent: number;
  opened: number;
  communication: number;
  won: number;
}

export interface ProposalItem {
  id: string;
  client: string;
  date: string;
  status: "Won" | "Communication" | "Opened" | "Sent";
  value: string;
}

export const proposalData: ProposalDataItem[] = [
  { name: "Created", value: 42, color: "#000000" },
  { name: "Sent", value: 38, color: "#333333" },
  { name: "Opened", value: 28, color: "#666666" },
  { name: "Communication", value: 16, color: "#999999" },
  { name: "Won", value: 8, color: "#cccccc" },
];

export const weeklyData: WeeklyDataItem[] = [
  { week: "Week 1", sent: 10, opened: 8, communication: 4, won: 2 },
  { week: "Week 2", sent: 8, opened: 6, communication: 3, won: 1 },
  { week: "Week 3", sent: 12, opened: 9, communication: 5, won: 3 },
  { week: "Week 4", sent: 8, opened: 5, communication: 4, won: 2 },
];

export const recentProposals: ProposalItem[] = [
  {
    id: "P-001",
    client: "Design Agency",
    date: "2025-04-01",
    status: "Won",
    value: "$2,500",
  },
  {
    id: "P-002",
    client: "Tech Startup",
    date: "2025-03-29",
    status: "Communication",
    value: "$3,800",
  },
  {
    id: "P-003",
    client: "E-commerce Site",
    date: "2025-03-27",
    status: "Opened",
    value: "$1,900",
  },
  {
    id: "P-004",
    client: "Marketing Firm",
    date: "2025-03-25",
    status: "Sent",
    value: "$4,200",
  },
];

export const calculateMetrics = () => {
  const openRate = Math.round(
    (proposalData[2].value / proposalData[1].value) * 100
  );
  const winRate = Math.round(
    (proposalData[4].value / proposalData[1].value) * 100
  );
  const responseRate = Math.round(
    (proposalData[3].value / proposalData[2].value) * 100
  );

  return {
    openRate,
    winRate,
    responseRate,
    totalPotentialRevenue: "$12,400",
    currentStreak: "7 days",
    monthlyProposals: "38 proposals",
    openRateTrend: { value: 4, direction: "up" },
    winRateTrend: { value: 2, direction: "up" },
    responseRateTrend: { value: 1, direction: "down" },
    revenueTrend: { value: 8, direction: "up" },
  };
};
