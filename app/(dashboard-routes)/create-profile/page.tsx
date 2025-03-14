"use client";
import Step1 from "@/components/create-profile/Step1";
import Step2 from "@/components/create-profile/Step2";
import Step3 from "@/components/create-profile/Step3";
import Step4 from "@/components/create-profile/Step4";
import React, { useReducer } from "react";

// Form state reducer
const initialState: CreateProfileState = {
  currentStep: 1,
  userInformation: {
    jobTitle: "",
    skills: [],
    bio: "",
    projects: [],
    isDefaultProfile: false,
  },
  // Add more fields as needed for other steps
};

function formReducer(state: CreateProfileState, action: CreateProfileAction) {
  switch (action.type) {
    case "SET_JOB_TITLE":
      return {
        ...state,
        userInformation: { ...state.userInformation, jobTitle: action.payload },
      };
    case "SET_SKILLS":
      return {
        ...state,
        userInformation: { ...state.userInformation, skills: action.payload },
      };
    case "SET_BIO":
      return {
        ...state,
        userInformation: { ...state.userInformation, bio: action.payload },
      };
    case "SET_PROJECTS":
      return {
        ...state,
        userInformation: { ...state.userInformation, projects: action.payload },
      };
    case "NEXT_STEP":
      return { ...state, currentStep: state.currentStep + 1 };
    case "PREV_STEP":
      return { ...state, currentStep: state.currentStep - 1 };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function MultiStepForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const { currentStep } = state;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-md mx-auto pt-8 sm:pt-12 md:pt-16 px-4">
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                    step === state.currentStep
                      ? "bg-black text-white"
                      : step < state.currentStep
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black border border-black"
                  }`}
                >
                  {step}
                </div>
                <div className="text-[10px] sm:text-xs mt-1">Step {step}</div>
              </div>
            ))}
          </div>

          {/* Progress line */}
          <div className="relative mt-2">
            <div className="absolute h-1 w-full bg-gray-200"></div>
            <div
              className="absolute h-1 bg-black transition-all duration-300"
              style={{ width: `${(state.currentStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg border">
          {currentStep === 1 && <Step1 state={state} dispatch={dispatch} />}
          {currentStep === 2 && <Step2 state={state} dispatch={dispatch} />}
          {currentStep === 3 && <Step3 state={state} dispatch={dispatch} />}
          {currentStep === 4 && <Step4 state={state} dispatch={dispatch} />}
        </div>
      </div>
    </div>
  );
}
