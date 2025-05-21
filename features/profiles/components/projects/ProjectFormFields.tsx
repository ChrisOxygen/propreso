import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../../schemas/projectSchema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProjectFormFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function ProjectFormFields({ form }: ProjectFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-[Poppins] tracking-[-0.4px] text-[#2C2C2C]">
              Project Title
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter project title"
                className="border-zinc-200 font-[Lato] focus:border-[#BF4008] focus:ring-[#BF4008]"
                {...field}
              />
            </FormControl>
            <FormDescription className="font-[Lato] tracking-[0.08px] text-[#404040]">
              The name of your project or application
            </FormDescription>
            <FormMessage className="font-[Lato] text-[#BF4008]" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-[Poppins] tracking-[-0.4px] text-[#2C2C2C]">
              Description
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your project, technologies used, and its purpose"
                className="min-h-[120px] resize-none border-zinc-200 font-[Lato] focus:border-[#BF4008] focus:ring-[#BF4008]"
                {...field}
              />
            </FormControl>
            <FormDescription className="font-[Lato] tracking-[0.08px] text-[#404040]">
              A detailed explanation of what your project does and how it works
            </FormDescription>
            <FormMessage className="font-[Lato] text-[#BF4008]" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="liveLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-[Poppins] tracking-[-0.4px] text-[#2C2C2C]">
                Live Demo URL
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://yourdemo.com"
                  className="border-zinc-200 font-[Lato] focus:border-[#BF4008] focus:ring-[#BF4008]"
                  {...field}
                />
              </FormControl>
              <FormDescription className="font-[Lato] tracking-[0.08px] text-[#404040]">
                Link to a working version of your project (optional)
              </FormDescription>
              <FormMessage className="font-[Lato] text-[#BF4008]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repoLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-[Poppins] tracking-[-0.4px] text-[#2C2C2C]">
                Repository URL
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://github.com/your/repo"
                  className="border-zinc-200 font-[Lato] focus:border-[#BF4008] focus:ring-[#BF4008]"
                  {...field}
                />
              </FormControl>
              <FormDescription className="font-[Lato] tracking-[0.08px] text-[#404040]">
                Link to your project&apos;s source code (optional)
              </FormDescription>
              <FormMessage className="font-[Lato] text-[#BF4008]" />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
