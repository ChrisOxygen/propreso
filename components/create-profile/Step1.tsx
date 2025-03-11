import React, { Dispatch } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";
import { JOB_TITLES } from "@/constants";

function Step1({
  state,
  dispatch,
}: {
  state: CreateProfileState;
  dispatch: Dispatch<CreateProfileAction>;
}) {
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
            dispatch({ type: "SET_JOB_TITLE", payload: value })
          }
          value={state.userInformation.jobTitle}
        >
          <SelectTrigger className="w-full border-black">
            <SelectValue placeholder="Select your field" />
          </SelectTrigger>
          <SelectContent className="bg-white border-black">
            {JOB_TITLES.map((jobTitle) => (
              <SelectItem key={jobTitle} value={jobTitle}>
                {jobTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        <Button
          className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
          disabled={!state.userInformation.jobTitle}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
        >
          Next
          <FiArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default Step1;
