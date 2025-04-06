"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Send, Save, RefreshCw, Loader2 } from "lucide-react";
import { useProposal } from "../../context/ProposalContext";
import { useDebounce } from "@/hooks/useDebounce";

const ProposalEditor = () => {
  const {
    proposal,
    isRefining,
    isProposalRefined,
    isGenerating,
    isSaving,
    setProposal,
    refineProposal,
    saveProposal,
    proposalId,
  } = useProposal();

  // Track the last saved proposal content to avoid unnecessary saves
  const [lastSavedProposal, setLastSavedProposal] = useState(proposal);

  // Create a debounced version of the proposal for auto-saving
  const debouncedProposal = useDebounce(proposal, 3000);

  // Auto-save functionality
  useEffect(() => {
    // Only save if:
    // 1. We have a proposal
    // 2. It's different from the last saved version
    // 3. We're not already in the middle of generating, refining, or saving
    if (
      debouncedProposal &&
      debouncedProposal !== lastSavedProposal &&
      !isGenerating &&
      !isRefining &&
      !isSaving
    ) {
      // Call the save function
      saveProposal();

      // Update the last saved state
      setLastSavedProposal(debouncedProposal);

      // Show a subtle toast notification
      toast("Auto-saved", {
        description: "Your proposal has been automatically saved",
        duration: 2000,
      });
    }
  }, [
    debouncedProposal,
    lastSavedProposal,
    isGenerating,
    isRefining,
    isSaving,
    saveProposal,
  ]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(proposal);
      toast("Copied!", {
        description: "Proposal copied to clipboard",
      });
    } catch (error) {
      toast("Failed to copy", {
        description: "Could not copy proposal to clipboard",
        duration: 2000,
      });
    }
  };

  const handleRefineProposal = () => {
    refineProposal();
  };

  const handlePasteInPlatform = async () => {
    try {
      await navigator.clipboard.writeText(proposal);
      toast("Ready to paste!", {
        description: "Proposal copied and ready to paste in your platform",
      });
    } catch (error) {
      toast("Failed to copy", {
        description: "Could not prepare proposal for pasting",
        duration: 2000,
      });
    }
  };

  const handleSave = () => {
    saveProposal();
    // Update the last saved state
    setLastSavedProposal(proposal);
    toast("Saving proposal...", {
      description: isProposalRefined
        ? "Saving your refined proposal"
        : "Saving your proposal",
    });
  };

  return (
    <div className="w-full h-full flex gap-4 flex-col @container">
      <Textarea
        placeholder="Your generated proposal will appear here..."
        className="flex-grow min-h-40 h-full max-h-full sm:h-[650px] sm:max-h-[650px] md:h-[715px] md:max-h-[715px] w-full border border-gray-300 p-4 text-black bg-white"
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        disabled={isGenerating || isRefining}
      />

      <div className="grid grid-cols-2 @[600px]:grid-cols-4 w-full gap-3 mt-auto">
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-black text-white hover:text-white border-gray-800 hover:bg-gray-800"
          onClick={copyToClipboard}
          disabled={!proposal || isGenerating || isRefining || isSaving}
        >
          <Copy size={16} />
          Copy
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white text-black border-gray-300 hover:bg-gray-100"
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
          className="flex items-center gap-2 bg-white text-black border-gray-300 hover:bg-gray-100"
          onClick={handlePasteInPlatform}
          disabled={!proposal || isGenerating || isRefining || isSaving}
        >
          <Send size={16} />
          Paste in Platform
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white text-black border-gray-300 hover:bg-gray-100"
          onClick={handleSave}
          disabled={
            isSaving ||
            !proposal ||
            isGenerating ||
            lastSavedProposal === proposal
          }
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : proposalId && proposal === lastSavedProposal ? (
            <>
              <Save size={16} />
              Saved to draft
            </>
          ) : (
            <>
              <Save size={16} />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProposalEditor;
