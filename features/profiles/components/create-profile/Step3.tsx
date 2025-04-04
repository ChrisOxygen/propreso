// components/create-profile/Step3.tsx

import { Button } from "@/components/ui/button";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { CreateProfileContextType } from "../../context/CreateProfileContext";

const Step3 = ({
  setBio,
  state: {
    userInformation: { jobTitle, skills, name },
  },

  prevStep,
  bioText,
  generateBio,
  refineBio,
  isGenerating,
  isRefining,
  isCreatingProfile,
  createFreelanceProfile,
}: CreateProfileContextType) => {
  // Local state for bio text

  // Go back to previous step
  const handleBack = () => {
    setBio(bioText);
    prevStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Create Your Professional Bio</h2>
        <p className="text-gray-600 mt-2">
          Tell potential clients about your experience and expertise.
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => generateBio({ jobTitle, skills, name })}
            disabled={isGenerating || isRefining || isCreatingProfile}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate with AI
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => refineBio({ bioText, jobTitle, skills })}
            disabled={
              isRefining || !bioText.trim() || isGenerating || isCreatingProfile
            }
            className="flex items-center gap-2"
          >
            {isRefining ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refine with AI
          </Button>
        </div>

        <Textarea
          value={bioText}
          onChange={(e) => {
            setBio(e.target.value); // Save bio to state
          }}
          placeholder="Write or generate a professional bio that highlights your expertise, experience, and what you bring to client projects..."
          className="min-h-[200px] resize-none"
          disabled={isGenerating || isRefining || isCreatingProfile}
        />

        <p className="text-xs text-gray-500">
          {bioText.length} characters | Recommended: 150-200 words
        </p>
      </div>

      <div className="flex justify-between mt-10">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center justify-center gap-2"
          disabled={isGenerating || isRefining || isCreatingProfile}
        >
          <FiArrowLeft />
          Back
        </Button>
        <Button
          className="bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
          onClick={createFreelanceProfile}
          disabled={
            !bioText.trim() || isGenerating || isRefining || isCreatingProfile
          }
        >
          Create profile
          <FiArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Step3;
