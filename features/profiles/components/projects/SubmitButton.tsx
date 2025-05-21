import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  text: string;
  loadingText: string;
  className?: string;
}

export function SubmitButton({
  isLoading,
  text,
  loadingText,
  className = "bg-[#BF4008] font-[Lato] font-medium text-white transition-colors duration-200 hover:bg-[#BF4008]/80",
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={`flex items-center gap-2 ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          {text}
        </>
      )}
    </Button>
  );
}
