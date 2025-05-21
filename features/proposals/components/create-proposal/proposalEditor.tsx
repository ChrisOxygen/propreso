"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Send, Save, RefreshCw, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePasteInPlatform } from "../../hooks/usePasteInPlatform";
import { useProposalForm } from "../../context/ProposalFormContext";
import { usePathname } from "next/navigation";

const ProposalEditor = ({ jobKey }: { jobKey?: string }) => {
  const pathname = usePathname();
  const isEditMode = pathname.includes("/edit");

  const {
    proposal,
    isRefining,
    isGenerating,
    isSaving,
    setProposal,
    refineProposal,
    saveProposal,
    jobDescription,
    proposalStatus,
  } = useProposalForm();

  // Track the last saved proposal content to avoid unnecessary saves
  const [lastSavedProposal, setLastSavedProposal] = useState(proposal);

  // Create a debounced version of the proposal for auto-saving
  const debouncedProposal = useDebounce(proposal, 3000);

  const { sendToExtension } = usePasteInPlatform(jobKey);

  // Update to handle disabled states
  const isProposalDisabled = useMemo(() => {
    return isGenerating || isRefining;
  }, [isGenerating, isRefining]);

  // Memoize the shouldSave condition
  const shouldSave = useMemo(() => {
    return (
      debouncedProposal &&
      debouncedProposal !== lastSavedProposal &&
      !isGenerating &&
      !isRefining &&
      !isSaving &&
      proposalStatus !== "SENT" // Only auto-save if not already sent
    );
  }, [
    debouncedProposal,
    lastSavedProposal,
    isGenerating,
    isRefining,
    isSaving,
    proposalStatus,
  ]);

  // Effect for auto-saving
  useEffect(() => {
    if (shouldSave) {
      saveProposal();
      setLastSavedProposal(debouncedProposal);
    }
  }, [shouldSave, saveProposal, debouncedProposal]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(proposal);
      toast("Copied!", {
        description: "Proposal copied to clipboard",
      });
      saveProposal("SENT");
      setLastSavedProposal(proposal);
    } catch (error) {
      toast("Failed to copy", {
        description: "Could not copy proposal to clipboard",
        duration: 2000,
      });
    }
  };

  const handleRefineProposal = () => {
    if (!proposal || !jobDescription) {
      toast.error(
        "Both job description and proposal are required for refinement",
      );
      return;
    }
    refineProposal();
  };

  const handlePasteInPlatform = async () => {
    if (!proposal) return;
    const url = jobKey
      ? `https://www.upwork.com/nx/proposals/job/~${jobKey}/apply/`
      : undefined;

    saveProposal("SENT");
    setLastSavedProposal(proposal);
    sendToExtension({
      proposalContent: proposal,
      redirectUrl: url as string,
    });
  };

  const handleSave = () => {
    // This will always save regardless of status
    saveProposal();
    // Update the last saved state
    setLastSavedProposal(proposal);
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setProposal(e.target.value);
    },
    [setProposal],
  );

  const isCopyDisabled = useMemo(() => {
    return !proposal || isGenerating || isRefining || isSaving;
  }, [proposal, isGenerating, isRefining, isSaving]);

  return (
    <div className="@container flex h-full w-full flex-col gap-4">
      <Textarea
        placeholder="Your generated proposal will appear here..."
        className="h-full max-h-full min-h-40 w-full flex-grow border border-gray-200 bg-white p-4 font-[Lato] tracking-[0.08px] text-[#2C2C2C] sm:h-[650px] sm:max-h-[650px] md:h-[715px] md:max-h-[715px]"
        value={proposal}
        onChange={handleChange}
        disabled={isProposalDisabled}
      />

      <div className="mt-auto grid w-full grid-cols-2 gap-3 @[600px]:grid-cols-4">
        {/* Copy button */}
        <Button
          onClick={copyToClipboard}
          disabled={isCopyDisabled}
          className="bg-[#BF4008] font-[Lato] font-medium text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
        >
          <Copy size={16} className="mr-2" />
          Copy
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-200 bg-white font-[Lato] font-medium text-[#2C2C2C] transition-colors duration-200 hover:bg-gray-50"
          onClick={handleRefineProposal}
          disabled={isRefining || !proposal || isGenerating || isSaving}
        >
          {isRefining ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Refining...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Refine Proposal
            </>
          )}
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-200 bg-white font-[Lato] font-medium text-[#2C2C2C] transition-colors duration-200 hover:bg-gray-50"
          onClick={handlePasteInPlatform}
          disabled={!proposal || isGenerating || isRefining || isSaving}
        >
          <Send size={16} />
          Paste in Platform
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-200 bg-white font-[Lato] font-medium text-[#2C2C2C] transition-colors duration-200 hover:bg-gray-50"
          onClick={handleSave}
          disabled={
            isSaving ||
            !proposal ||
            isGenerating ||
            (proposalStatus !== "SENT" && lastSavedProposal === proposal) // Enable button if status is SENT and there are changes
          }
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              {proposalStatus === "SENT"
                ? "Update"
                : isEditMode
                  ? "Update"
                  : "Save"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProposalEditor;
