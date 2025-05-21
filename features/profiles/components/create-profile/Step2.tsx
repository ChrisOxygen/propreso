import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { ALL_SKILLS } from "@/constants";
import { CreateProfileContextType } from "../../context/CreateProfileContext";

// Step 2 Component for selecting skills
const Step2 = ({
  state,
  setSkills,
  nextStep,
  prevStep,
}: CreateProfileContextType) => {
  // Local state to track selected skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    state.userInformation.skills || [],
  );

  // Get skills for the selected field
  const key = state.userInformation.jobTitle
    .split(" ")
    .join("-")
    .toLowerCase() as keyof typeof ALL_SKILLS;

  const fieldSkills = ALL_SKILLS[key as keyof typeof ALL_SKILLS];

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Save skills to state when clicking Next
  const handleNext = () => {
    setSkills(selectedSkills);
    nextStep();
  };

  // Go back to previous step
  const handleBack = () => {
    setSkills(selectedSkills);
    prevStep();
  };

  // Field name for display (convert kebab-case to Title Case)
  const fieldName = key
    ? key
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[Poppins] text-2xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
          Select Your Skills
        </h2>
        <p className="mt-2 font-[Lato] tracking-[0.08px] text-[#404040]">
          Choose the skills that best represent your expertise as a {fieldName}.
        </p>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {fieldSkills.length > 0 &&
            fieldSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                className={`rounded-full px-4 py-2 font-[Lato] text-sm font-medium transition-colors duration-200 ${
                  selectedSkills.includes(skill)
                    ? "bg-[#BF4008] text-white"
                    : "bg-[#FDF9F6] text-[#404040] hover:bg-[#F8E5DB]"
                }`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
        </div>
        {selectedSkills.length > 0 && (
          <p className="mt-4 font-[Lato] text-sm tracking-[0.08px] text-[#404040]">
            Selected: {selectedSkills.length}{" "}
            {selectedSkills.length === 1 ? "skill" : "skills"}
          </p>
        )}
      </div>

      <div className="mt-10 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center justify-center gap-2 border-zinc-200 bg-white font-[Lato] text-[#404040] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#BF4008] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          className="flex items-center justify-center gap-2 bg-[#BF4008] font-[Lato] text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
          onClick={handleNext}
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step2;
