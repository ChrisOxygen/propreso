import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Sparkles,
  RefreshCw,
  Send,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useProposal } from "@/context/ProposalContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Define form validation schema with zod
const formSchema = z.object({
  proposal: z
    .string()
    .min(10, { message: "Proposal must be at least 10 characters." })
    .max(10000, { message: "Proposal cannot exceed 10000 characters." }),
});

// Infer the form values type from the schema
type FormValues = z.infer<typeof formSchema>;

const ProposalForm = () => {
  const {
    jobDescription,
    proposal,
    setProposal,
    generateProposal,
    refineProposal,
    isGenerating,
    isRefining,
    error,
  } = useProposal();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(false);

  // Initialize form with zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposal: proposal || "",
    },
  });

  // Update form when proposal changes in context
  useEffect(() => {
    form.setValue("proposal", proposal);
  }, [proposal, form]);

  // Handle form errors from context
  useEffect(() => {
    if (error) {
      form.setError("proposal", {
        type: "manual",
        message: error.message || "An error occurred with your proposal",
      });
    }
  }, [error, form]);

  // Form submission handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Replace with your actual submission API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Proposal submitted successfully!");
    } catch (error) {
      console.error("Error submitting proposal:", error);
      form.setError("proposal", {
        type: "manual",
        message: "Failed to submit proposal. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle job description visibility for mobile view
  const toggleJobDescription = () => {
    setShowJobDescription(!showJobDescription);
  };

  return (
    <div className="w-full h-full mx-auto p-4 bg-white text-black">
      {/* Mobile-only job description toggle */}
      <div className="lg:hidden mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={toggleJobDescription}
          className="w-full flex items-center justify-between"
        >
          <span>Job Description</span>
          {showJobDescription ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {showJobDescription && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md border overflow-y-auto max-h-[200px]">
            <pre className="whitespace-pre-wrap text-sm">
              {jobDescription || "No job description available."}
            </pre>
          </div>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 flex flex-col h-full"
        >
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || "An error occurred. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="proposal"
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col">
                <FormLabel className="text-lg font-medium text-black">
                  Your Proposal
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your proposal here or generate one..."
                    className="flex-1 min-h-[200px] lg:min-h-[300px] border border-gray-300 bg-white text-black resize-none"
                    {...field}
                    disabled={isGenerating || isRefining || isSubmitting}
                    onChange={(e) => {
                      field.onChange(e);
                      setProposal(e.target.value);
                    }}
                  />
                </FormControl>
                <div className="flex justify-between items-center mt-2">
                  <FormMessage className="text-red-500" />
                  <span className="text-sm text-gray-500">
                    {field.value.length} / 10000 characters
                  </span>
                </div>
              </FormItem>
            )}
          />

          {/* Action buttons - stack on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              type="button"
              onClick={() => generateProposal()}
              disabled={
                isGenerating ||
                isRefining ||
                isSubmitting ||
                !jobDescription.trim()
              }
              className="flex-1 bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Proposal
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={() => refineProposal()}
              disabled={
                isGenerating || isRefining || isSubmitting || !proposal.trim()
              }
              className="flex-1 border border-black bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2"
            >
              {isRefining ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refining...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refine Proposal
                </>
              )}
            </Button>

            <Button
              type="submit"
              disabled={
                isGenerating || isRefining || isSubmitting || !proposal.trim()
              }
              className="flex-1 bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Proposal
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProposalForm;
