import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, RefreshCw, Send } from "lucide-react";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposal: "",
    },
  });

  // Generate proposal handler
  const handleGenerateProposal = async () => {
    setIsGenerating(true);
    try {
      // Here you would call your API to generate a proposal
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set the generated proposal in the form
      form.setValue(
        "proposal",
        "This is a sample generated proposal. Replace this with your actual AI-generated content from your API call."
      );
    } catch (error) {
      console.error("Error generating proposal:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Refine proposal handler
  const handleRefineProposal = async () => {
    const currentProposal = form.getValues("proposal");

    if (!currentProposal.trim()) {
      form.setError("proposal", {
        type: "manual",
        message: "Please generate or write a proposal first before refining",
      });
      return;
    }

    setIsRefining(true);
    try {
      // Here you would call your API to refine the proposal
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set the refined proposal in the form
      form.setValue(
        "proposal",
        currentProposal +
          "\n\n[This proposal has been refined and improved. Replace this with your actual refinement logic.]"
      );
    } catch (error) {
      console.error("Error refining proposal:", error);
    } finally {
      setIsRefining(false);
    }
  };

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Here you would send the proposal to your API
      console.log("Submitting proposal:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form or handle success
      // form.reset();
      alert("Proposal submitted successfully!");
    } catch (error) {
      console.error("Error submitting proposal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full mx-auto p-4 bg-white text-black">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col h-full"
        >
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
                    className="flex-1 min-h-[300px] border border-gray-300 bg-white text-black resize-none"
                    {...field}
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

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              type="button"
              onClick={handleGenerateProposal}
              disabled={isGenerating || isRefining || isSubmitting}
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
              onClick={handleRefineProposal}
              disabled={isGenerating || isRefining || isSubmitting}
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
              disabled={isGenerating || isRefining || isSubmitting}
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
