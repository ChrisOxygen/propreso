import { AVAILABLE_PLATFORMS } from "@/constants";

export const analizingJobDetails = async (details: JobDetailsFromPlatform) => {
  console.log("function in services------ analizingJobDetails", details);
  const response = await fetch("/api/analize-job-details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  return data as AnalizedUpworkJobData;
};

/**
 * Converts camelCase or dot notation to snake_case
 */
export function toSnakeCase(str: string): string {
  // Replace dots with underscores first
  const result = str.replace(/\./g, "_");

  // Then convert camelCase to snake_case
  return result.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * Flattens the job data object into an array of key-value pairs with snake_case keys
 */
export function flattenJobData(
  jobData: AnalizedUpworkJobData
): FlattenedItem[] {
  // Initialize result array
  const flattened: FlattenedItem[] = [];

  // Extract client name, job title, and job description for the first three indices
  const clientName = jobData.clientInfo?.clientName || "Unknown Client";
  const jobTitle = jobData.jobDetails.title;
  const jobDescription = jobData.jobDetails.description;

  // Add the first three required fields with snake_case keys
  flattened.push({ client_name: clientName });
  flattened.push({ job_title: jobTitle });
  flattened.push({ job_description: jobDescription });

  // Define a generic type for recursive object processing
  type NestedObject = Record<string, unknown>;

  // Function to recursively process nested objects
  function processObject(obj: NestedObject, prefix: string = ""): void {
    if (!obj) return;

    Object.entries(obj).forEach(([key, value]) => {
      // Skip the clientName, jobTitle, and jobDescription as they're already added
      if (
        (prefix === "clientInfo." && key === "clientName") ||
        (prefix === "jobDetails." && key === "title") ||
        (prefix === "jobDetails." && key === "description")
      ) {
        return;
      }

      const fullKey = prefix + key;
      const snakeCaseKey = toSnakeCase(fullKey);

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Recursively process nested objects
        processObject(value as NestedObject, fullKey + ".");
      } else if (Array.isArray(value)) {
        // Handle arrays
        const arrayObj: FlattenedItem = {};
        arrayObj[snakeCaseKey] = value.join(", ");
        flattened.push(arrayObj);
      } else {
        // Add simple key-value pair
        const keyValueObj: FlattenedItem = {};
        keyValueObj[snakeCaseKey] = value as string | boolean | number;
        flattened.push(keyValueObj);
      }
    });
  }

  // Process jobDetails and clientInfo objects
  processObject(jobData.jobDetails, "jobDetails.");

  if (jobData.clientInfo) {
    processObject(jobData.clientInfo, "clientInfo.");
  }

  return flattened;
}

/**
 * Parse Upwork job details URL and extract job information
 * @param url The Upwork job details URL
 * @returns Object containing the platform and job ID
 */
export function parseJobUrl(url: string): {
  platform: string;
  jobId: string | null;
} {
  // Extract job ID - any digits after a tilde (~) character
  const match = url.match(/~(\d{10,})/);

  return {
    platform: "upwork",
    jobId: match && match[1] ? match[1] : null,
  };
}

/**
 * Gets platform data by platform name
 * @param platformName The name of the platform to look up
 * @returns Platform data or undefined if not found
 */
export function getPlatformData(platformName: string) {
  return AVAILABLE_PLATFORMS.find(
    (p) => p.name.toLowerCase() === platformName.toLowerCase()
  );
}

/**
 * Formats a platform URL by replacing the [jobId] placeholder with the actual job ID
 * @param platformName The name of the platform
 * @param jobId The job ID to insert into the URL
 * @returns Formatted URL or null if platform not found
 */
export function formatPlatformUrl(
  platformName: string,
  jobId: string
): string | null {
  const platformData = getPlatformData(platformName);
  if (!platformData) return null;

  return platformData.urlStructure.replace("[jobId]", jobId);
}

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

/**
 * Generates breadcrumb items from a given pathname
 *
 * @param pathname - The current URL pathname (e.g., "/settings/profile")
 * @param homeLabel - Optional label for the home breadcrumb (defaults to "Dashboard")
 * @param homeHref - Optional href for the home breadcrumb (defaults to "/")
 * @returns Array of breadcrumb items with label, href, and isCurrentPage properties
 */
export function generateBreadcrumbs(
  pathname: string,
  homeLabel: string = "Dashboard",
  homeHref: string = "/dashboard"
): BreadcrumbItem[] {
  // Skip the first empty string after splitting
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Create an array to store breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = [];

  // Start with home/dashboard
  breadcrumbs.push({
    label: homeLabel,
    href: homeHref,
    isCurrentPage: pathSegments.length === 1 && pathSegments[0] === "dashboard",
  });

  if (pathSegments.length === 1 && pathSegments[0] === "dashboard") {
    return breadcrumbs;
  }

  // Build the rest of the breadcrumbs
  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Format the segment for display (capitalize, replace hyphens, etc.)
    const formattedLabel = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      label: formattedLabel,
      href: currentPath,
      isCurrentPage: index === pathSegments.length - 1,
    });
  });

  return breadcrumbs;
}
