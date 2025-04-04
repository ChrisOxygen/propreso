import React from "react";
import { useCreateProfileContext } from "../../context/CreateProfileContext";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

function MultiStepForm() {
  const context = useCreateProfileContext();
  const { state } = context;
  return (
    <div className="w-full max-w-[600px] mt-[100px] flex  flex-col">
      {state.currentStep === 1 && <Step1 {...context} />}
      {state.currentStep === 2 && <Step2 {...context} />}
      {state.currentStep === 3 && <Step3 {...context} />}
    </div>
  );
}

export default MultiStepForm;
