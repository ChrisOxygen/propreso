import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";

import { useProjectForm } from "../../hooks/projects/useProjectForm";
import { AIGenerateButton } from "./AIGenerateButton";
import { ProjectFormFields } from "./ProjectFormFields";
import { SubmitButton } from "./SubmitButton";
import FormSuggestions from "../FormSuggestions";

type ProjectFormProps = {
  setDialogOpen: (dialogOpen: boolean) => void;
  profileId: string;
  project?: Project;
  exitEditMode?: () => void;
  isEditMode: boolean;
};

export function ProjectForm({
  setDialogOpen,
  profileId,
  project,
  exitEditMode,
  isEditMode,
}: ProjectFormProps) {
  const {
    form,
    generateDesc,
    isGeneratingDesc,
    handleSubmit,
    isCreatingProject,
    isUpdatingProject,
    submitButtonText,
    submitButtonLoadingText,
    onCancel,
  } = useProjectForm({
    project,
    profileId,
    setDialogOpen,
    exitEditMode,
    isEditMode,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 py-4"
      >
        <AIGenerateButton
          onClick={() => generateDesc(form.getValues())}
          isLoading={isGeneratingDesc}
        />

        <ProjectFormFields form={form} />

        <FormSuggestions />

        <DialogFooter className="pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <SubmitButton
            isLoading={isCreatingProject || isUpdatingProject}
            loadingText={submitButtonLoadingText}
            text={submitButtonText}
          />
        </DialogFooter>
      </form>
    </Form>
  );
}

export default ProjectForm;
