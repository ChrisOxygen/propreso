import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteProposalById } from "../actions";
import { toast } from "sonner";

interface UseDeleteProposalProps {
  onMutate?: () => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteProposal({
  onMutate,
  onSuccess,
  onError,
}: UseDeleteProposalProps = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      // No browser confirmation here - we use the AlertDialog instead
      const response = await deleteProposalById(id);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete proposal");
      }

      return response;
    },
    onMutate: () => {
      if (onMutate) onMutate();
    },
    onSuccess: (data, id) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });

      // Show success toast
      toast.success(data.message || "Proposal deleted successfully");

      // Redirect to proposals list
      router.push("/proposals");

      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete proposal");
      console.error("Error deleting proposal:", error);

      if (onError) onError(error);
    },
  });

  const deleteProposal = (id: string) => {
    mutation.mutate(id);
  };

  return {
    deleteProposal,
    isDeleting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
