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
