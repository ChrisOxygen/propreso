import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  jobDescription: z
    .string()
    .min(10, { message: "Job description must be at least 10 characters." })
    .max(5000, { message: "Job description cannot exceed 5000 characters." }),
});

// Infer the form values type from the schema
type FormValues = z.infer<typeof formSchema>;

const JobDescriptionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Here you would send the data to your API
      console.log("Generating proposal for:", values.jobDescription);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error generating proposal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full mx-auto p-3 bg-white text-black">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-6 flex flex-col h-full"
        >
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem className="h-full items-start flex flex-col">
                <FormLabel className="text-lg font-medium text-black">
                  Enter Job Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the job description here..."
                    className=" border h-full w-full bg-white text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-black font-medium" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800 border-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Generating..." : "Generate Proposal"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default JobDescriptionForm;
