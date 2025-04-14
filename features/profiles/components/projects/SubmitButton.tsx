import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  text: string;
  loadingText: string;
}

export function SubmitButton({
  isLoading,
  text,
  loadingText,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="flex items-center gap-2"
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
