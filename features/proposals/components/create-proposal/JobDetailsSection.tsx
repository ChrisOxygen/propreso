import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useProposal } from "../../context/ProposalContext";
import { PROPOSAL_FORMULAS, TONES } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";

// Define the form schema with Zod
const formSchema = z.object({
  jobTitle: z.string().min(3, {
    message: "Job title must be at least 3 characters.",
  }),
  formula: z.string(),
  tone: z.string(),
  jobDescription: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
  includePortfolio: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

// Minimum job description length for auto-generating title
const MIN_JOB_DESC_LENGTH_FOR_AUTO_TITLE = 100;

export default function JobDetailsSection() {
  // Get context values and methods
  const {
    jobDescription,
    proposalTitle,
    formula,
    tone,
    includePortfolio,
    isGenerating,
    isRefining,
    isGeneratingTitle,
    setJobDescription,
    setProposalTitle,
    setFormula,
    setTone,
    setIncludePortfolio,
    generateProposal,
    generateJobTitle,
  } = useProposal();

  // Set up form with default values from context
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      formula: "aida",
      tone: "professional",
      jobDescription: "",
      includePortfolio: false,
    },
  });

  // Update form when context values change
  useEffect(() => {
    // Update all form fields from context
    form.setValue("jobDescription", jobDescription || "");
    form.setValue("jobTitle", proposalTitle || "");
    form.setValue("formula", formula || "aida");
    form.setValue("tone", tone || "professional");
    form.setValue("includePortfolio", includePortfolio || false);
  }, [jobDescription, proposalTitle, formula, tone, includePortfolio, form]);

  // Create debounced version of job description for auto title generation
  const debouncedJobDescription = useDebounce(jobDescription, 1000);

  // Auto-generate title when job description is long enough and no title exists
  useEffect(() => {
    if (
      debouncedJobDescription &&
      debouncedJobDescription.length >= MIN_JOB_DESC_LENGTH_FOR_AUTO_TITLE &&
      (!proposalTitle || proposalTitle.trim() === "") &&
      !isGeneratingTitle
    ) {
      generateJobTitle();
    }
  }, [
    debouncedJobDescription,
    proposalTitle,
    isGeneratingTitle,
    generateJobTitle,
  ]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    // Update all context values first
    setJobDescription(data.jobDescription);
    setProposalTitle(data.jobTitle);
    setFormula(data.formula);
    setTone(data.tone);
    setIncludePortfolio(data.includePortfolio);

    // Check if we need to generate a title first
    if (!data.jobTitle || data.jobTitle.trim() === "") {
      // Generate title first, then the proposal will be generated after
      generateJobTitle();
      return;
    }

    // Otherwise, proceed with generating the proposal
    generateProposal();
  };

  // Check if any generation process is happening
  const isProcessing = isGenerating || isRefining;

  return (
    <div className="flex flex-col h-full gap-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-5 flex flex-col h-full"
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="formula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal Formula</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setFormula(value);
                    }}
                    value={formula || field.value}
                    disabled={isProcessing}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a formula" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROPOSAL_FORMULAS.map((formula) => (
                        <SelectItem key={formula.id} value={formula.id}>
                          {formula.label}
                          <span className="hidden lg:inline">
                            ({formula.labelFull})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    {
                      PROPOSAL_FORMULAS.find(
                        (f) => f.id === (formula || field.value)
                      )?.description
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone of Voice</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTone(value);
                    }}
                    value={tone || field.value}
                    disabled={isProcessing}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TONES.map((tone) => (
                        <SelectItem key={tone.id} value={tone.id}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    {
                      TONES.find((t) => t.id === (tone || field.value))
                        ?.description
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  {isGeneratingTitle ? (
                    <Skeleton className="w-full h-10" />
                  ) : (
                    <Input
                      placeholder="Enter the job title..."
                      className="bg-white"
                      {...field}
                      value={proposalTitle || field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setProposalTitle(e.target.value);
                      }}
                      disabled={isProcessing || isGeneratingTitle}
                    />
                  )}
                </FormControl>
                <FormDescription className="text-xs">
                  {isGeneratingTitle
                    ? "Generating title based on job description..."
                    : "Title will auto-generate once you add job description"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem className="space-y-1.5 flex-1 flex flex-col">
                <FormLabel>Job Description</FormLabel>
                <FormControl className="flex-1 flex flex-col">
                  <Textarea
                    placeholder="Paste the job description here..."
                    className="min-h-40 h-full md:h-[440px] max-h-full md:max-h-[440px] overflow-y-auto resize-none bg-white"
                    {...field}
                    value={jobDescription || field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      setJobDescription(e.target.value);
                    }}
                    disabled={isProcessing}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Paste the complete job listing for a more targeted proposal
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="includePortfolio"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-2 pt-1">
                <FormControl>
                  <Checkbox
                    checked={includePortfolio || field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      setIncludePortfolio(!!checked);
                    }}
                    className="mt-0.5"
                    disabled={isProcessing}
                  />
                </FormControl>
                <div>
                  <FormLabel className="text-sm font-medium">
                    Add portfolio samples
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={
              isGenerating || isRefining || isGeneratingTitle || !jobDescription
            }
            className="w-full mt-4"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Generating...
              </>
            ) : isGeneratingTitle ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Generating Title...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Generate Proposal
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
