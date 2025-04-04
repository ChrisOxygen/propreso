"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Github, Eye, Edit, Save, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDebounce } from "@/hooks/useDebounce";
import ProjectStrength from "./ProjectStrength";
import FormSuggestions from "./FormSuggestions";
import { generateSvgImage } from "../utils";
import { useProjectStength } from "../hooks/useProjectStength";

// Define Zod schema for project validation
const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  liveLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  repoLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

const ProjectCard = ({ project, onUpdate }: ProjectCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<Partial<ProjectFormValues>>({});
  const debouncedFormValues = useDebounce(formValues, 3000);

  // Description truncation
  const MAX_DESCRIPTION_LENGTH = 100;
  const descriptionSnippet =
    project.description.length > MAX_DESCRIPTION_LENGTH
      ? `${project.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
      : project.description;

  // React Hook Form setup with Zod validation
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      liveLink: project.liveLink || "",
      repoLink: project.repoLink || "",
    },
  });

  // TanStack Query mutation for project strength
  const {
    mutate: checkProjectStrength,
    data: strengthData,
    projectStengthPending,
  } = useProjectStength();

  // Handle form submission
  const handleSubmit = (values: ProjectFormValues): void => {
    if (onUpdate) {
      onUpdate({ ...project, ...values });
    }
    setIsEditMode(false);
    setIsModalOpen(false);
  };

  // Handle opening the modal
  const handleOpenModal = (): void => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Handle entering edit mode and check strength
  const handleEnterEditMode = (): void => {
    setIsEditMode(true);
    // Reset form with current project values
    form.reset({
      title: project.title,
      description: project.description,
      liveLink: project.liveLink || "",
      repoLink: project.repoLink || "",
    });

    // Check project strength
    const currentValues = {
      title: project.title,
      description: project.description,
      liveLink: project.liveLink || "",
      repoLink: project.repoLink || "",
    };
    setFormValues(currentValues);
    checkProjectStrength(currentValues);
  };

  // Check strength manually
  const handleCheckStrength = (): void => {
    const values = form.getValues();
    checkProjectStrength(values);
  };

  // Watch for form changes
  useEffect(() => {
    if (isEditMode) {
      const subscription = form.watch((values) => {
        setFormValues(values as ProjectFormValues);
      });

      return () => subscription.unsubscribe();
    }
  }, [form, isEditMode]);

  // Check strength when debounced form values change
  useEffect(() => {
    if (isEditMode && Object.keys(debouncedFormValues).length > 0) {
      checkProjectStrength(debouncedFormValues as ProjectFormValues);
    }
  }, [debouncedFormValues, isEditMode, checkProjectStrength]);

  return (
    <>
      <Card className="h-full flex flex-col shadow-none">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={project.featuredImage || generateSvgImage(project.title)}
            alt={project.title}
            className="w-full h-full object-cover"
            width={300}
            height={500}
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <CardDescription>{descriptionSnippet}</CardDescription>
        </CardContent>
        <CardFooter className="pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleOpenModal}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {project.liveLink && (
            <Button variant="outline" size="sm" className="h-8">
              <ExternalLink className="h-4 w-4 mr-1" />
              Live
            </Button>
          )}
          {project.repoLink && (
            <Button variant="outline" size="sm" className="h-8">
              <Github className="h-4 w-4 mr-1" />
              Repo
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Project View/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className={`${
            isEditMode ? "sm:max-w-[900px]" : "sm:max-w-[700px]"
          } max-h-[90vh] overflow-hidden p-0`}
        >
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>
              {!isEditMode ? project.title : "Edit Project"}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-9rem)]">
            <div className="px-6">
              {!isEditMode ? (
                /* View Mode */
                <div className="space-y-4 py-4">
                  <DialogDescription className="text-gray-700 whitespace-pre-line">
                    {project.description}
                  </DialogDescription>
                  <div className="flex flex-wrap gap-4 pt-4">
                    {project.liveLink && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Live Project
                        </a>
                      </Button>
                    )}
                    {project.repoLink && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.repoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          View Repository
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4 py-4"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
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
                              {...field}
                              rows={5}
                              placeholder="Provide a detailed description of your project..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="liveLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Live Link</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://..." />
                            </FormControl>
                            <FormDescription>
                              URL to the live project (optional)
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
                            <FormLabel>Repository Link</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://github.com/..."
                              />
                            </FormControl>
                            <FormDescription>
                              URL to the code repository (optional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Tips section below the form */}
                    <div className="mt-6 space-y-4">
                      {/* Project Strength Section */}
                      <ProjectStrength
                        strength={strengthData?.strength || 0}
                        suggestions={strengthData?.suggestions || []}
                        isLoading={projectStengthPending}
                      />

                      {/* Tips for a Great Project */}
                      <FormSuggestions />
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t mb-3">
            {!isEditMode ? (
              <>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={handleEnterEditMode}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditMode(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCheckStrength}
                  className="relative"
                >
                  {projectStengthPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Check Strength
                </Button>
                <Button onClick={form.handleSubmit(handleSubmit)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
