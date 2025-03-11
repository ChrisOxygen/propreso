import React, { Dispatch, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";

const Step3 = ({
  state,
  dispatch,
}: {
  state: CreateProfileState;
  dispatch: Dispatch<CreateProfileAction>;
}) => {
  // Local state for bio text
  const [bioText, setBioText] = useState<string>(
    state.userInformation.bio || ""
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);

  // Save bio to state when clicking Next
  const handleNext = () => {
    dispatch({ type: "SET_BIO", payload: bioText });
    dispatch({ type: "NEXT_STEP" });
  };

  // Go back to previous step
  const handleBack = () => {
    dispatch({ type: "SET_BIO", payload: bioText });
    dispatch({ type: "PREV_STEP" });
  };

  // Generate bio with OpenAI
  const generateBio = async () => {
    setIsGenerating(true);
    try {
      const { jobTitle, skills } = state.userInformation;

      // Get the user's name - you'll need to adapt this based on your auth implementation
      // This is just a placeholder - replace with actual code to get the user's name
      const userName = "User"; // Replace with actual user's name from your auth context/state

      const response = await fetch("/api/generate-bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          jobTitle,
          skills,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate bio");
      }

      const data = await response.json();
      setBioText(data.bio);
    } catch (error) {
      console.error("Error generating bio:", error);
      // Show error message to user
    } finally {
      setIsGenerating(false);
    }
  };

  // Refine existing bio with OpenAI
  const refineBio = async () => {
    if (!bioText.trim()) {
      return; // Don't refine empty bio
    }

    setIsRefining(true);
    try {
      const response = await fetch("/api/refine-bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentBio: bioText,
          jobTitle: state.userInformation.jobTitle,
          skills: state.userInformation.skills,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refine bio");
      }

      const data = await response.json();
      setBioText(data.refinedBio);
    } catch (error) {
      console.error("Error refining bio:", error);
      // Show error message to user
    } finally {
      setIsRefining(false);
    }
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
            onClick={generateBio}
            disabled={isGenerating}
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
            onClick={refineBio}
            disabled={isRefining || !bioText.trim()}
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
          onChange={(e) => setBioText(e.target.value)}
          placeholder="Write or generate a professional bio that highlights your expertise, experience, and what you bring to client projects..."
          className="min-h-[200px] resize-none"
        />

        <p className="text-xs text-gray-500">
          {bioText.length} characters | Recommended: 100-300 characters
        </p>
      </div>

      <div className="flex justify-between mt-10">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center justify-center gap-2"
        >
          <FiArrowLeft />
          Back
        </Button>
        <Button
          className="bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
          onClick={handleNext}
          disabled={!bioText.trim()}
        >
          Next
          <FiArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Step3;
