import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { JOB_TITLES } from "@/constants";
import { CreateProfileContextType } from "../../context/CreateProfileContext";

function Step1({ state, setJobTitle, nextStep }: CreateProfileContextType) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[Poppins] text-2xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
          Select Your Field
        </h2>
        <p className="mt-2 font-[Lato] tracking-[0.08px] text-[#404040]">
          Please select your professional field from the options below.
        </p>
      </div>

      <div className="mt-4">
        <Select
          onValueChange={(value) => setJobTitle(value as string)}
          value={state.userInformation.jobTitle}
        >
          <SelectTrigger className="w-full border-zinc-200 font-[Lato] text-[#404040] focus:border-[#BF4008] focus:ring-[#BF4008]">
            <SelectValue placeholder="Select your field" />
          </SelectTrigger>
          <SelectContent className="border-zinc-200 bg-white">
            {JOB_TITLES.map((jobTitle) => (
              <SelectItem
                key={jobTitle}
                value={jobTitle}
                className="font-[Lato] text-[#404040]"
              >
                {jobTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        <Button
          className="flex w-full items-center justify-center gap-2 bg-[#BF4008] font-[Lato] text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
          disabled={!state.userInformation.jobTitle}
          onClick={() => nextStep()}
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default Step1;
