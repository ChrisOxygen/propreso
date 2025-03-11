import React, { Dispatch } from "react";
import { Button } from "@/components/ui/button";
import { FiArrowLeft, FiPlus, FiTrash } from "react-icons/fi";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { projectSchema } from "@/formSchemas";
import { useCreateProfile } from "@/hooks/user-profile-hooks/useCreateProfile";
import { useUser } from "@/hooks/useUser";

type ProjectFormValues = z.infer<typeof projectSchema>;

const Step4 = ({
  state,
  dispatch,
}: {
  state: CreateProfileState;
  dispatch: Dispatch<CreateProfileAction>;
}) => {
  // Initialize the form with existing projects from state or at least one empty project
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projects: state.userInformation.projects?.length
        ? state.userInformation.projects
        : [{ title: "", liveLink: "", githubLink: "", description: "" }],
    },
  });
  const { data: user, isLoading: userLoading } = useUser();
  const { createProfile, isLoading } = useCreateProfile();

  // Use field array to manage dynamic project fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  // Add a new empty project
  const addProject = () => {
    if (fields.length < 4) {
      append({ title: "", liveLink: "", githubLink: "", description: "" });
    }
  };

  // Remove a project
  const removeProject = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Handle form submission
  const onSubmit = (values: ProjectFormValues, setAsDefault = false) => {
    dispatch({ type: "SET_PROJECTS", payload: values.projects });

    const profileData = {
      ...state.userInformation,
      projects: values.projects,
      isDefaultProfile: user?.hasCreatedProfile ? setAsDefault : true,
    };

    // Call the mutation function from our custom hook
    createProfile(profileData);
  };

  // Go back to previous step
  const handleBack = () => {
    // Save current form state before going back
    const currentValues = form.getValues();
    dispatch({ type: "SET_PROJECTS", payload: currentValues.projects });
    dispatch({ type: "PREV_STEP" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add Your Projects</h2>
        <p className="text-gray-600 mt-2">
          Showcase your best work by adding 1-4 projects that demonstrate your
          skills.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values, false))}
          className="space-y-6"
        >
          {fields.map((field, index) => (
            <Card key={field.id} className="p-0 overflow-hidden">
              <CardContent className="p-6 pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Project {index + 1}</h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProject(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <FiTrash className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`projects.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="My Awesome Project" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.liveLink`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Live URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://myproject.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.githubLink`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://github.com/username/project"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Problems Solved & Technologies Used*
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the problems you solved and the technologies you used..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include the challenges you faced, how you solved them,
                          and the technologies used.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {fields.length < 4 && (
            <Button
              type="button"
              variant="outline"
              onClick={addProject}
              className="w-full border-dashed"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Another Project
            </Button>
          )}

          {fields.length >= 4 && (
            <Alert
              variant="default"
              className="bg-amber-50 text-amber-800 border-amber-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Maximum number of projects reached (4)
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-4 mt-8">
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex items-center justify-center gap-2"
              >
                <FiArrowLeft />
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading || userLoading}
                className="bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create Profile
                  </>
                )}
              </Button>
            </div>

            <Button
              type="button"
              onClick={() =>
                form.handleSubmit((values) => onSubmit(values, true))()
              }
              disabled={isLoading || userLoading}
              className="w-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Create Profile and Set as Default
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Step4;
