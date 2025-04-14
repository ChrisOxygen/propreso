"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useSaveOrUpdateProposal } from "@/features/proposals/hooks/useSaveOrUpdateProposal";
import { Proposal, ProposalStatus } from "@prisma/client";

interface UpdateProposalStatusButtonProps {
  proposal: Proposal;
}

export function UpdateProposalStatusButton({
  proposal,
}: UpdateProposalStatusButtonProps) {
  const {
    id,
    title,
    jobDescription,
    proposal: proposalText,
    status: currentStatus,
  } = proposal;

  const [isWonDialogOpen, setIsWonDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ProposalStatus | null>(
    null
  );

  const { saveProposal, isSaving, isSuccess } = useSaveOrUpdateProposal(
    id,
    currentStatus
  );

  // Show a toast notification when the status is updated successfully
  useEffect(() => {
    if (isSuccess) {
      toast.success("Proposal status updated successfully!");
      // Close dialog if it was open
      setIsWonDialogOpen(false);
      setPendingStatus(null);
    }
  }, [isSuccess]);

  const statuses: ProposalStatus[] = ["DRAFT", "SENT", "WON"];

  const handleStatusChange = async (status: ProposalStatus) => {
    if (status === currentStatus || !id) return;

    // If user is trying to set status to WON, show warning dialog
    if (status === "WON") {
      setPendingStatus(status);
      setIsWonDialogOpen(true);
      return;
    }

    // For other statuses, update immediately
    saveProposal({
      title,
      jobDescription,
      proposal: proposalText,
      status: status,
    });
  };

  const handleConfirmWonStatus = () => {
    if (!pendingStatus || pendingStatus !== "WON" || !id) return;

    saveProposal({
      title,
      jobDescription,
      proposal: proposalText,
      status: pendingStatus,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={isSaving}
            className="flex gap-2 items-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                Update Status
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {statuses.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusChange(status)}
              className="flex items-center justify-between"
            >
              {status}
              {currentStatus === status && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog for WON status confirmation */}
      <AlertDialog open={isWonDialogOpen} onOpenChange={setIsWonDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Setting a proposal status to WON is permanent. You will not be
              able to edit or change the status of this proposal after this
              action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPendingStatus(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmWonStatus}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
