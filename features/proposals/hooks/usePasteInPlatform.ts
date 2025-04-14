import { useState, useEffect } from "react";
import { toast } from "sonner";

// Proposal data structure
interface ProposalData {
  proposalContent: string;
}

// Parameters for the sendToExtension function
interface SendToExtensionParams {
  proposalContent: string;
  redirectUrl: string;
}

// Base message structure for all extension communications
interface ExtensionMessage {
  type: string;
  action: string;
  messageId?: string;
}

// Base structure for messages sent from Next.js to extension
interface NextJsToExtensionMessage extends ExtensionMessage {
  type: "FROM_NEXTJS_APP";
  responseAction: string;
}

// Structure for storing proposal data
interface StoreProposalMessage extends NextJsToExtensionMessage {
  action: "storeProposalData";
  responseAction: "PROPOSAL_STORED";
  storageKey: string;
  data: ProposalData;
}

// Structure for redirecting and pasting
interface RedirectAndPasteMessage extends NextJsToExtensionMessage {
  action: "redirectAndPaste";
  responseAction: "REDIRECT_INITIATED";
  redirectUrl: string;
  storageKey: string;
}

// Structure for ping message
interface PingMessage extends ExtensionMessage {
  type: "FROM_NEXTJS_APP";
  action: "PING";
}

// Base structure for messages received from extension
interface ExtensionToNextJsMessage extends ExtensionMessage {
  type: "FROM_EXTENSION";
  success: boolean;
  error?: string;
  messageId?: string;
}

// Response to proposal storage
interface ProposalStoredResponse extends ExtensionToNextJsMessage {
  action: "PROPOSAL_STORED";
}

// Response to redirect request
interface RedirectInitiatedResponse extends ExtensionToNextJsMessage {
  action: "REDIRECT_INITIATED";
}

export function usePasteInPlatform(jobKey?: string) {
  const [isSending, setIsSending] = useState(false);
  const [extensionConnected, setExtensionConnected] = useState(false);
  const [messageListenerAdded, setMessageListenerAdded] = useState(false);

  // Set up listener for messages from the extension bridge
  useEffect(() => {
    if (typeof window === "undefined" || messageListenerAdded) return;

    const handleExtensionMessages = (event: MessageEvent) => {
      // Only accept messages from same window (security measure)
      if (event.source !== window) return;

      console.log("Received window message:", event.data);

      // Check if message is from extension bridge
      if (event.data.type && event.data.type === "FROM_EXTENSION") {
        console.log("Received FROM_EXTENSION message:", event.data);

        // If bridge is ready or we get a pong, mark extension as connected
        if (
          event.data.action === "BRIDGE_READY" ||
          event.data.action === "PONG"
        ) {
          console.log("Extension bridge connected via:", event.data.action);
          setExtensionConnected(true);
        }
      }
    };

    // Add event listener
    window.addEventListener("message", handleExtensionMessages);
    setMessageListenerAdded(true);

    // Immediately try to ping the extension
    setTimeout(() => {
      console.log("Sending initial PING to check extension");
      const pingMessage: PingMessage = {
        type: "FROM_NEXTJS_APP",
        action: "PING",
      };
      window.postMessage(pingMessage, "*");
    }, 500);

    // Cleanup
    return () => {
      window.removeEventListener("message", handleExtensionMessages);
    };
  }, [messageListenerAdded]);

  // Function to check extension connection
  const checkConnection = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (extensionConnected) {
        return resolve(true);
      }

      console.log("Checking extension connection...");

      // Set up one-time listener for PONG
      const pingListener = (event: MessageEvent) => {
        if (event.source !== window) return;

        if (
          event.data.type === "FROM_EXTENSION" &&
          event.data.action === "PONG"
        ) {
          console.log("Received PONG from extension");
          window.removeEventListener("message", pingListener);
          setExtensionConnected(true);
          resolve(true);
        }
      };

      window.addEventListener("message", pingListener);

      // Send PING
      const pingMessage: PingMessage = {
        type: "FROM_NEXTJS_APP",
        action: "PING",
      };
      window.postMessage(pingMessage, "*");

      // Set timeout to remove listener
      setTimeout(() => {
        window.removeEventListener("message", pingListener);
        resolve(false);
      }, 1000);
    });
  };

  // Send message to extension bridge via postMessage with typed parameters and response
  const sendMessageToBridge = <
    T extends NextJsToExtensionMessage,
    R extends ExtensionToNextJsMessage
  >(
    message: T
  ): Promise<R> => {
    return new Promise((resolve, reject) => {
      // Create unique message ID to identify response
      const messageId = Date.now().toString();
      const messageWithId = { ...message, messageId };

      // Set up listener for response
      const responseListener = (event: MessageEvent) => {
        // Security check
        if (event.source !== window) return;

        console.log(
          "Checking response:",
          event.data,
          "for action:",
          message.responseAction
        );

        // Check if message is from extension and matches our request by messageId or action
        if (
          event.data.type === "FROM_EXTENSION" &&
          ((event.data.messageId && event.data.messageId === messageId) ||
            event.data.action === message.responseAction)
        ) {
          // Clean up listener and timeout
          window.removeEventListener("message", responseListener);
          clearTimeout(timeout);

          if (event.data.success) {
            resolve(event.data as R);
          } else {
            reject(new Error(event.data.error || "Extension operation failed"));
          }
        }
      };

      // Add listener for response
      window.addEventListener("message", responseListener);

      // Set timeout for response
      const timeout = setTimeout(() => {
        window.removeEventListener("message", responseListener);
        reject(new Error("Extension communication timed out"));
      }, 10000); // 10 second timeout

      // Send message to extension bridge
      window.postMessage(messageWithId, "*");

      console.log("Sent message to extension bridge:", messageWithId);
    });
  };

  const sendToExtension = async ({
    proposalContent,
    redirectUrl,
  }: SendToExtensionParams): Promise<boolean> => {
    if (!jobKey) {
      toast.error("Missing job information", {
        description: "Unable to send proposal without job details",
      });
      return false;
    }

    setIsSending(true);

    try {
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        throw new Error("Not in browser environment");
      }

      // Force check for extension connection
      const isConnected = await checkConnection();

      if (!isConnected) {
        throw new Error(
          "Extension not detected. Please ensure the Propreso extension is installed and active."
        );
      }

      // Generate a unique storage key based on jobKey and timestamp
      const storageKey = `proposal_${jobKey}_${Date.now()}`;

      // Create the proposal data object
      const proposalData: ProposalData = {
        proposalContent,
      };

      console.log("Sending proposal data to extension:", {
        storageKey,
        proposalContentLength: proposalContent.length,
      });

      // Step 1: Store the proposal data in extension storage
      try {
        // Use the background script's storage API through the bridge
        const storeMessage: StoreProposalMessage = {
          type: "FROM_NEXTJS_APP",
          action: "storeProposalData",
          responseAction: "PROPOSAL_STORED",
          storageKey,
          data: proposalData,
        };

        await sendMessageToBridge<StoreProposalMessage, ProposalStoredResponse>(
          storeMessage
        );
        console.log("Proposal data stored in extension");
      } catch (error) {
        throw new Error(
          `Failed to store proposal data: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }

      // Step 2: Trigger redirect to Upwork and paste the proposal
      try {
        const redirectMessage: RedirectAndPasteMessage = {
          type: "FROM_NEXTJS_APP",
          action: "redirectAndPaste",
          responseAction: "REDIRECT_INITIATED",
          redirectUrl,
          storageKey,
        };

        await sendMessageToBridge<
          RedirectAndPasteMessage,
          RedirectInitiatedResponse
        >(redirectMessage);
        console.log("Redirect and paste initiated");
      } catch (error) {
        throw new Error(
          `Failed to redirect to application page: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }

      toast.success("Proposal sent", {
        description: "Your proposal will be pasted in the platform",
      });

      return true;
    } catch (error) {
      console.error("Error sending proposal to extension:", error);
      let errorMessage = "Extension not found or error communicating with it";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error("Failed to send proposal", {
        description: errorMessage,
      });

      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendToExtension,
    isSending,
    extensionConnected,
  };
}
