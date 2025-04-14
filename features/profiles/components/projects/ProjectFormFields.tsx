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
            <FormLabel>Project Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter project title" {...field} />
            </FormControl>
            <FormDescription>
              The name of your project or application
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your project, technologies used, and its purpose"
                className="resize-none min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A detailed explanation of what your project does and how it works
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="liveLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Live Demo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://yourdemo.com" {...field} />
              </FormControl>
              <FormDescription>
                Link to a working version of your project (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repoLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/your/repo" {...field} />
              </FormControl>
              <FormDescription>
                Link to your project&apos;s source code (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
