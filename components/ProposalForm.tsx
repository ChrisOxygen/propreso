import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Sparkles,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formatPlatformUrl, getPlatformData } from "@/lib/services";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useProposal } from "@/context/ProposalContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useJobDetailsQuery } from "@/hooks/cover-letter/useJobDetailsQuery";
import { toast } from "sonner";

// Define form validation schema with zod
const formSchema = z.object({
  proposal: z
    .string()
    .min(10, { message: "Proposal must be at least 10 characters." })
    .max(10000, { message: "Proposal cannot exceed 10000 characters." }),
});

// Infer the form values type from the schema
type FormValues = z.infer<typeof formSchema>;

const ProposalForm = () => {
  const {
    jobDescription,
    proposal,
    setProposal,
    generateProposal,
    refineProposal,
    isGenerating,
    isRefining,
    error,
  } = useProposal();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(false);
  const searchParams = useSearchParams();
  const jobDetailsId = searchParams.get("jobDetailsId");

  // Fetch job details if jobId is present
  const { data: jobDetails } = useJobDetailsQuery(
    jobDetailsId || "",
    !!jobDetailsId
  );

  // Extract platform from job details
  const platform = jobDetails?.platform || "";
  const platformName = platform
    ? platform.charAt(0).toUpperCase() + platform.slice(1)
    : "";

  // Initialize form with zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposal: proposal || "",
    },
  });

  // Update form when proposal changes in context
  useEffect(() => {
    form.setValue("proposal", proposal);
  }, [proposal, form]);

  // Handle form errors from context
  useEffect(() => {
    if (error) {
      form.setError("proposal", {
        type: "manual",
        message: error.message || "An error occurred with your proposal",
      });
    }
  }, [error, form]);

  // Form submission handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Replace with your actual submission API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Proposal submitted successfully!");
    } catch (error) {
      console.error("Error submitting proposal:", error);
      form.setError("proposal", {
        type: "manual",
        message: "Failed to submit proposal. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle job description visibility for mobile view
  const toggleJobDescription = () => {
    setShowJobDescription(!showJobDescription);
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    if (proposal) {
      navigator.clipboard
        .writeText(proposal)
        .then(() => {
          toast.success("Proposal copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          toast.error("Failed to copy proposal");
        });
    }
  };

  // Helper function to copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(proposal)
      .then(() => {
        toast.success(
          `Proposal copied! Paste it in the ${platformName} editor.`
        );
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy proposal");
      });
  };

  // Handle "Open in Editor" action
  const handlePasteInEditor = () => {
    if (proposal && platform && jobDetails?.platformJobId) {
      // Get the platform data from our constants
      const platformData = getPlatformData(platform);

      if (!platformData) {
        toast.error(`Platform ${platformName} is not supported yet.`);
        return;
      }

      // Format the URL by replacing [jobId] with the actual job ID
      const formattedUrl = formatPlatformUrl(
        platform,
        jobDetails.platformJobId
      );

      if (!formattedUrl) {
        toast.error(`Unable to generate URL for ${platformName}.`);
        return;
      }

      // Set loading state
      setIsSubmitting(true);

      // Store proposal in localStorage with a unique key
      const storageKey = `proposal_${jobDetails.platformJobId}`;
      localStorage.setItem(storageKey, proposal);

      // Check if we're in a browser environment and if Chrome extension API exists
      if (
        window.chrome &&
        window.chrome.runtime &&
        window.chrome.runtime.sendMessage
      ) {
        const EXTENSION_ID = process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID;

        if (!EXTENSION_ID) {
          console.error("Extension ID not configured");
          toast.error("Extension configuration missing");
          // Fallback to normal open and copy
          window.open(formattedUrl, "_blank");
          copyToClipboard();
          setIsSubmitting(false);
          return;
        }

        const message = {
          type: "PASTE_PROPOSAL",
          payload: {
            platform,
            url: formattedUrl,
            proposal,
            selector: platformData.coverLetterSelector,
            storageKey, // Pass the storage key to the extension
          },
        };

        // Log attempt to send message
        console.log("Attempting to send message to Chrome extension:", message);

        // Send message to Chrome extension with explicit extension ID
        window.chrome.runtime.sendMessage(
          EXTENSION_ID, // Specify the extension ID
          message,
          (response) => {
            console.log("Chrome extension response:", response);
            setIsSubmitting(false);

            if (window.chrome.runtime.lastError) {
              console.error(
                "Chrome runtime error:",
                window.chrome.runtime.lastError
              );
              toast.error(
                `Chrome extension error: ${window.chrome.runtime.lastError.message}`
              );
              // Fallback to normal open and copy
              window.open(formattedUrl, "_blank");
              copyToClipboard();
              return;
            }

            if (response && response.success) {
              toast.success(`Opening ${platformName} proposal page...`);
              window.open(formattedUrl, "_blank");
            } else {
              console.error("Extension failed:", response?.error);
              toast.error(
                `Failed to communicate with extension. Opening ${platformName} editor manually.`
              );
              // Fallback to clipboard and manual open
              window.open(formattedUrl, "_blank");
              copyToClipboard();
            }
          }
        );
      } else {
        console.log("Chrome extension not detected, using fallback");
        // If extension not detected, default to opening URL and copying to clipboard
        window.open(formattedUrl, "_blank");
        copyToClipboard();
        setIsSubmitting(false);
      }
    } else {
      toast.error("Missing proposal, platform, or job ID information");
    }
  };

  return (
    <div className="w-full h-full mx-auto p-4 bg-white text-black">
      {/* Mobile-only job description toggle */}
      <div className="lg:hidden mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={toggleJobDescription}
          className="w-full flex items-center justify-between"
        >
          <span>Job Description</span>
          {showJobDescription ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {showJobDescription && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md border overflow-y-auto max-h-[200px]">
            <pre className="whitespace-pre-wrap text-sm">
              {jobDescription || "No job description available."}
            </pre>
          </div>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 flex flex-col h-full"
        >
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || "An error occurred. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="proposal"
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col">
                <FormLabel className="text-lg font-medium text-black">
                  Your Proposal
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your proposal here or generate one..."
                    className="flex-1 min-h-[200px] lg:min-h-[300px] border border-gray-300 bg-white text-black resize-none"
                    {...field}
                    disabled={isGenerating || isRefining || isSubmitting}
                    onChange={(e) => {
                      field.onChange(e);
                      setProposal(e.target.value);
                    }}
                  />
                </FormControl>
                <div className="flex justify-between items-center mt-2">
                  <FormMessage className="text-red-500" />
                  <span className="text-sm text-gray-500">
                    {field.value.length} / 10000 characters
                  </span>
                </div>
              </FormItem>
            )}
          />

          {/* Action buttons - stack on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              type="button"
              onClick={() => generateProposal()}
              disabled={
                isGenerating ||
                isRefining ||
                isSubmitting ||
                !jobDescription.trim()
              }
              className="flex-1 bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Proposal
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={() => refineProposal()}
              disabled={
                isGenerating || isRefining || isSubmitting || !proposal.trim()
              }
              className="flex-1 border border-black bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2"
            >
              {isRefining ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refining...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refine Proposal
                </>
              )}
            </Button>

            {jobDetailsId && platformName ? (
              // Show two buttons when we have job details and platform
              <>
                <Button
                  type="button"
                  onClick={handleCopyToClipboard}
                  disabled={
                    isGenerating ||
                    isRefining ||
                    isSubmitting ||
                    !proposal.trim()
                  }
                  className="flex-1 bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>

                <Button
                  type="button"
                  onClick={handlePasteInEditor}
                  disabled={
                    isGenerating ||
                    isRefining ||
                    isSubmitting ||
                    !proposal.trim()
                  }
                  className="flex-1 bg-gray-600 text-white hover:bg-gray-500 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Opening..." : `Open in ${platformName}`}
                </Button>
              </>
            ) : (
              // Only show copy button without job details
              <Button
                type="button"
                onClick={handleCopyToClipboard}
                disabled={
                  isGenerating || isRefining || isSubmitting || !proposal.trim()
                }
                className="flex-1 bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Proposal
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProposalForm;
