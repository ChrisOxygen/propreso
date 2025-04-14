/**
 * React hook to access job data from the Chrome extension
 * Data is automatically removed from extension storage after successful retrieval
 *
 * @param {string} jobKey - The job key used to store the data in extension storage
 * @returns {Object} - The job data and loading state
 */
import { useState, useEffect, useRef } from "react";

interface JobData {
  postTitle?: string;
  jobDescription?: string;
  reviewSection?: string | null;
  timestamp?: string;
  url?: string;
}

interface UseChromeExtensionDataResult {
  data: JobData | null;
  loading: boolean;
  error: string | null;
  bridgeActive: boolean;
  dataRemoved: boolean;
}

export function useChromeExtensionData(
  jobKey?: string | null
): UseChromeExtensionDataResult {
  const [data, setData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bridgeActive, setBridgeActive] = useState<boolean>(false);
  const [dataRemoved, setDataRemoved] = useState<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 5;
  const dataRetrievedRef = useRef<boolean>(false);

  useEffect(() => {
    // Reset state when job key changes
    setData(null);
    setLoading(true);
    setError(null);
    setDataRemoved(false);
    retryCountRef.current = 0;
    dataRetrievedRef.current = false;

    // Skip if no job key is provided
    if (!jobKey) {
      setLoading(false);
      setError("No job key provided");
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;

    // Handler for messages from the content script
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window) return;

      if (event.data.type === "FROM_EXTENSION") {
        if (event.data.action === "BRIDGE_READY") {
          console.log("Chrome extension bridge is active");
          setBridgeActive(true);
        }

        if (event.data.action === "HTML_DATA") {
          setLoading(false);

          if (event.data.success && event.data.data) {
            console.log("Received job data:", event.data.data);
            setData(event.data.data);
            setError(null);

            // Mark that data was removed from extension storage
            if (event.data.dataRemoved) {
              setDataRemoved(true);
              console.log(
                "Job data was retrieved and removed from extension storage"
              );
            }

            // Prevent further retries
            dataRetrievedRef.current = true;

            // Clear retry interval if we have data
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
          } else {
            setError(event.data.error || "Failed to retrieve job data");
            setData(null);
          }
        }
      }
    };

    // Add message listener
    window.addEventListener("message", handleMessage);

    // Request the data from extension
    const requestData = () => {
      // Skip if we already received data
      if (dataRetrievedRef.current) return;

      console.log("Requesting job data from extension, key:", jobKey);
      window.postMessage(
        {
          type: "FROM_NEXTJS_APP",
          action: "GET_STORED_HTML",
          storageKey: jobKey,
        },
        "*"
      );
    };

    // Check if bridge is active after a timeout
    const timeoutId = setTimeout(() => {
      if (!bridgeActive) {
        setLoading(false);
        setError(
          "Chrome extension not detected. Please make sure the extension is installed and enabled."
        );
      }
    }, 2000);

    // Request data as soon as component mounts
    requestData();

    // Set up a polling interval to retry a few times
    intervalId = setInterval(() => {
      if (dataRetrievedRef.current || retryCountRef.current >= maxRetries) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        return;
      }

      requestData();
      retryCountRef.current += 1;
      console.log(`Retry attempt ${retryCountRef.current} of ${maxRetries}`);
    }, 2000);

    // Cleanup
    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobKey, bridgeActive]); // Only these dependencies

  return { data, loading, error, bridgeActive, dataRemoved };
}
