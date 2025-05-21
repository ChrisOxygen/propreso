// components/create-profile/Step3.tsx

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
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
  // Go back to previous step
  const handleBack = () => {
    setBio(bioText);
    prevStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[Poppins] text-2xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
          Create Your Professional Bio
        </h2>
        <p className="mt-2 font-[Lato] tracking-[0.08px] text-[#404040]">
          Tell potential clients about your experience and expertise.
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => generateBio({ jobTitle, skills, name })}
            disabled={isGenerating || isRefining || isCreatingProfile}
            className="flex items-center gap-2 bg-[#BF4008] font-[Lato] text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
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
            className="flex items-center gap-2 border-zinc-200 font-[Lato] text-[#404040] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#FDF9F6] hover:text-[#BF4008]"
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
            setBio(e.target.value);
          }}
          placeholder="Write or generate a professional bio that highlights your expertise, experience, and what you bring to client projects..."
          className="min-h-[200px] resize-none border-zinc-200 font-[Lato] text-[#404040] focus:border-[#BF4008] focus:ring-[#BF4008]"
          disabled={isGenerating || isRefining || isCreatingProfile}
        />

        <p className="font-[Lato] text-xs tracking-[0.08px] text-[#404040]">
          {bioText.length} characters | Recommended: 150-200 words
        </p>
      </div>

      <div className="mt-10 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center justify-center gap-2 border-zinc-200 bg-white font-[Lato] text-[#404040] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#BF4008] hover:text-white"
          disabled={isGenerating || isRefining || isCreatingProfile}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          className="flex items-center justify-center gap-2 bg-[#BF4008] font-[Lato] text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
          onClick={createFreelanceProfile}
          disabled={
            !bioText.trim() || isGenerating || isRefining || isCreatingProfile
          }
        >
          Create profile
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step3;
