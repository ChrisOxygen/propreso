import { ProposalChartItem } from "./types";

/**
 * Maps colors to specific proposal statuses
 */
const STATUS_COLORS = {
  Draft: "#000000",
  Sent: "#333333",
  Opened: "#666666",
  Communication: "#999999",
  Won: "#cccccc",
};

/**
 * Type for the formatted chart data with added color property
 */
export interface FormattedChartItem {
  name: string;
  value: number;
  color: string;
}

/**
 * Formats chart data by adding a color property based on status
 * @param chartData The raw chart data from API/context
 * @returns A new array with name, value, and color properties
 */
export function formatChartDataWithColors(
  chartData: ProposalChartItem[]
): FormattedChartItem[] {
  if (!chartData || chartData.length === 0) {
    return [];
  }

  return chartData.map((item) => ({
    name: item.status,
    value: item.count,
    color:
      STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || "#dddddd",
  }));
}

/**
 * Formats a proposal's createdAt date to display as "24th Mar 2019"
 * @param createdAt - Date object from proposal.createdAt
 * @returns Formatted date string with ordinal suffix
 */
export const formatProposalDate = (createdAt: Date): string => {
  if (!createdAt) return "N/A";

  // Get day with ordinal suffix
  const day = createdAt.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);

  // Get 3-letter month abbreviation
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[createdAt.getMonth()];

  // Format with day + suffix, month abbreviation, and year
  return `${day}${ordinalSuffix} ${month} ${createdAt.getFullYear()}`;
};

/**
 * Returns the appropriate ordinal suffix for a number
 * @param day - Day of month (1-31)
 * @returns Ordinal suffix (st, nd, rd, or th)
 */
const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

/**
 * Formats proposal chart data for use in a pie chart
 * @param chartData The raw chart data with period breakdowns
 * @returns Array of objects formatted for a pie chart
 */
export const formatPieChartData = (
  chartData: {
    periodTitle: string;
    DRAFT: number;
    SENT: number;
    WON: number;
  }[]
) => {
  // Initialize counters for each status
  let draftTotal = 0;
  let sentTotal = 0;
  let wonTotal = 0;

  // Sum up all counts across periods
  chartData.forEach((item) => {
    draftTotal += item.DRAFT || 0;
    sentTotal += item.SENT || 0;
    wonTotal += item.WON || 0;
  });

  // Create the pie chart data array
  return [
    {
      status: "DRAFT",
      numOfProposals: draftTotal,
      fill: "#000", // Slate/gray fill for drafts
    },
    {
      status: "SENT",
      numOfProposals: sentTotal,
      fill: "#666666", // Dark slate for sent
    },
    {
      status: "WON",
      numOfProposals: wonTotal,
      fill: "#ececec", // Nearly black for won
    },
  ].filter((item) => item.numOfProposals > 0); // Only include statuses with proposals
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Won":
    case "WON":
      return "bg-black text-white hover:bg-black/90";
    case "Sent":
    case "SENT":
      return "bg-zinc-600 text-white hover:bg-zinc-600/90";
    case "Draft":
    case "DRAFT":
    default:
      return "bg-zinc-200 text-zinc-800 hover:bg-zinc-300/90";
  }
};
