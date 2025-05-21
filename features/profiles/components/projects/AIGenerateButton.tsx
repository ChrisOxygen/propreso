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
      className="flex items-center gap-2 border-zinc-200 bg-white font-[Lato] text-[#2C2C2C] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#BF4008] hover:text-white"
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
