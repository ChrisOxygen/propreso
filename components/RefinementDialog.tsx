import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface RefinementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRefine: () => void;
  onProceed: () => void;
  platformName?: string;
  isSubmitting?: boolean;
}

export function RefinementDialog({
  isOpen,
  onClose,
  onRefine,
  onProceed,
  platformName,
  isSubmitting,
}: RefinementDialogProps) {
  const action = platformName ? `submit to ${platformName}` : "copy";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Unrefined Proposal
          </DialogTitle>
          <DialogDescription>
            Your proposal hasn&apos;t been refined yet. The generated proposal
            is usually raw and may include guidelines and explanations that
            should be removed.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-700">
            We recommend refining your proposal for better results. However, if
            you&apos;ve already manually refined it or wrote it yourself, you
            can proceed.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={onRefine}
          >
            <RefreshCw className="h-4 w-4" />
            Refine Proposal
          </Button>
          <Button
            className="w-full sm:w-auto bg-black hover:bg-gray-800"
            onClick={onProceed}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : `Proceed to ${action}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
