import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles } from "lucide-react";

export interface ProposalFormula {
  id: string;
  label: string;
  description: string;
}

export interface ProposalTone {
  id: string;
  label: string;
  description: string;
}

export interface ProposalOptions {
  formula: string;
  tone: string;
}

interface ProposalFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: ProposalOptions) => void;
  isGenerating: boolean;
}

const formulas: ProposalFormula[] = [
  {
    id: "aida",
    label: "AIDA (Attention, Interest, Desire, Action)",
    description:
      "Captures attention, builds interest, creates desire, and prompts action",
  },
  {
    id: "pas",
    label: "PAS (Problem, Agitate, Solution)",
    description:
      "Identifies a problem, amplifies its impact, and presents your solution",
  },
  {
    id: "bab",
    label: "BAB (Before, After, Bridge)",
    description:
      "Contrasts current state with desired state, with you as the bridge",
  },
  {
    id: "star",
    label: "STAR (Situation, Task, Action, Result)",
    description:
      "Describes the situation, task at hand, your action, and the results",
  },
  {
    id: "fab",
    label: "FAB (Feature, Advantage, Benefit)",
    description: "Showcases features, their advantages, and client benefits",
  },
];

const tones: ProposalTone[] = [
  {
    id: "professional",
    label: "Professional",
    description: "Clear, straightforward, and business-appropriate",
  },
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm, approachable, and conversational",
  },
];

export function ProposalFormDialog({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}: ProposalFormDialogProps) {
  const [selectedFormula, setSelectedFormula] = useState<string>("aida");
  const [selectedTone, setSelectedTone] = useState<string>("professional");

  const handleGenerate = () => {
    onGenerate({
      formula: selectedFormula,
      tone: selectedTone,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Proposal</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Proposal Formula</h3>
            <div className="space-y-3">
              {formulas.map((formula) => (
                <div key={formula.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`formula-${formula.id}`}
                    checked={selectedFormula === formula.id}
                    onCheckedChange={() => setSelectedFormula(formula.id)}
                  />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor={`formula-${formula.id}`}
                      className="font-medium"
                    >
                      {formula.label}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {formula.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tone of Voice</h3>
            <div className="space-y-3">
              {tones.map((tone) => (
                <div key={tone.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`tone-${tone.id}`}
                    checked={selectedTone === tone.id}
                    onCheckedChange={() => setSelectedTone(tone.id)}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor={`tone-${tone.id}`} className="font-medium">
                      {tone.label}
                    </Label>
                    <p className="text-sm text-gray-500">{tone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Proposal
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
