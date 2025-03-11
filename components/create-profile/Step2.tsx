import React, { Dispatch, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { ALL_SKILLS } from "@/constants";

// Step 2 Component for selecting skills
const Step2 = ({
  state,
  dispatch,
}: {
  state: CreateProfileState;
  dispatch: Dispatch<CreateProfileAction>;
}) => {
  // Local state to track selected skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    state.userInformation.skills || []
  );

  // Get skills for the selected field
  const key = state.userInformation.jobTitle
    .split(" ")
    .join("-")
    .toLowerCase() as keyof typeof ALL_SKILLS;

  console.log(key);
  const fieldSkills = ALL_SKILLS[key as keyof typeof ALL_SKILLS];

  console.log(fieldSkills);

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
    dispatch({ type: "SET_SKILLS", payload: selectedSkills });
    dispatch({ type: "NEXT_STEP" });
  };

  // Go back to previous step
  const handleBack = () => {
    dispatch({ type: "SET_SKILLS", payload: selectedSkills });
    dispatch({ type: "PREV_STEP" });
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
        <h2 className="text-2xl font-bold">Select Your Skills</h2>
        <p className="text-gray-600 mt-2">
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSkills.includes(skill)
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
        </div>
        {selectedSkills.length > 0 && (
          <p className="text-gray-500 mt-4 text-sm">
            Selected: {selectedSkills.length}{" "}
            {selectedSkills.length === 1 ? "skill" : "skills"}
          </p>
        )}
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
        >
          Next
          <FiArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Step2;
