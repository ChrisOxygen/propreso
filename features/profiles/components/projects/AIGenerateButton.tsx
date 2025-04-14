import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface AIGenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function AIGenerateButton({
  onClick,
  isLoading,
}: AIGenerateButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      Generate with AI
    </Button>
  );
}
