"use client";
import React, { Dispatch, useReducer } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";

// Form state reducer
const initialState = {
  currentStep: 1,
  userInformation: {
    jobTitle: "",
    skills: [],
    bio: "",
    portfolioProjects: [],
  },
  // Add more fields as needed for other steps
};

interface State {
  currentStep: number;
  field: string;
}

interface Action {
  type: string;
  payload?: any;
}

function formReducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, field: action.payload };
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

// Step 1 Component
const Step1 = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Select Your Field</h2>
        <p className="text-gray-600 mt-2">
          Please select your professional field from the options below.
        </p>
      </div>

      <div className="mt-4">
        <Select
          onValueChange={(value) =>
            dispatch({ type: "SET_FIELD", payload: value })
          }
          value={state.field}
        >
          <SelectTrigger className="w-full border-black">
            <SelectValue placeholder="Select your field" />
          </SelectTrigger>
          <SelectContent className="bg-white border-black">
            <SelectItem value="wordpress-designer">
              WordPress Designer
            </SelectItem>
            <SelectItem value="frontend-developer">
              Frontend Developer
            </SelectItem>
            <SelectItem value="backend-developer">
              Back-end Developer
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        <Button
          className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
          disabled={!state.field}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
        >
          Next
          <FiArrowRight />
        </Button>
      </div>
    </div>
  );
};

// Step placeholders for future steps
const Step2 = () => <div>Step 2 content will go here</div>;
const Step3 = () => <div>Step 3 content will go here</div>;
const Step4 = () => <div>Step 4 content will go here</div>;

export default function MultiStepForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Render the current step
  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1 state={state} dispatch={dispatch} />;
      case 2:
        return <Step2 state={state} dispatch={dispatch} />;
      case 3:
        return <Step3 state={state} dispatch={dispatch} />;
      case 4:
        return <Step4 state={state} dispatch={dispatch} />;
      default:
        return <Step1 state={state} dispatch={dispatch} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-md mx-auto pt-16 px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === state.currentStep
                      ? "bg-black text-white"
                      : step < state.currentStep
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black border border-black"
                  }`}
                >
                  {step}
                </div>
                <div className="text-xs mt-1">Step {step}</div>
              </div>
            ))}
          </div>

          {/* Progress line */}
          <div className="relative mt-2">
            <div className="absolute h-1 w-full bg-gray-200"></div>
            <div
              className="absolute h-1 bg-black"
              style={{ width: `${(state.currentStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">{renderStep()}</div>
      </div>
    </div>
  );
}
