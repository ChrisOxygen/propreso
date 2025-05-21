import React from "react";
import { useCreateProfileContext } from "../../context/CreateProfileContext";
import { Separator } from "@/components/ui/separator";

function CreateProfileTips() {
  const {
    state: { currentStep },
  } = useCreateProfileContext();
  if (!currentStep) return null;
  const tips = [
    {
      title: "select your field",
      description: "Choose the field that best represents your expertise.",
    },
    {
      title: "add your skills",
      description:
        "List the skills you possess that are relevant to your field. list up to 8 skills to make your profile strong.",
    },

    {
      title: "write a bio",
      description:
        "Clear professional identity: Your title/role, years of experience, and primary specialization Technical expertise: Specific skills, tools, and technologies with indication of proficiency levels \nValue proposition: Problems you solve and benefits you deliver to clients/employers \nCredibility: Specific achievements with quantifiable results (numbers, percentages, metrics) \nA well-balanced bio will establish who you are professionally, showcase your technical capabilities, explain the value you provide, and validate your expertise with concrete accomplishments.",
    },
  ];

  const currentTip = tips[currentStep - 1];
  const { title, description } = currentTip || {};

  if (!title || !description) return null;

  return (
    <div className="mt-10 w-full rounded-md bg-[#ee9a5a]/20 p-3 text-sm">
      <h4 className="mb-2 font-[Poppins] font-medium tracking-[-0.4px] text-[#2C2C2C] uppercase">
        Profile Tips
      </h4>
      <Separator className="mb-2 bg-[#ee9a5a]/50" />
      <div className="flex w-full flex-col gap-1">
        {currentStep === 3 ? (
          <div className="flex flex-col gap-2 font-[Lato] text-[#404040]">
            <p className="tracking-[0.08px]">
              Write a concise bio (100-200 words) that includes
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li className="tracking-[0.08px]">
                Clear professional identity: Your title/role, years of
                experience, and primary specializatio
              </li>
              <li className="tracking-[0.08px]">
                Technical expertise: Specific skills, tools, and technologies
                with indication of proficiency levels
              </li>
              <li className="tracking-[0.08px]">
                Value proposition: Problems you solve and benefits you deliver
                to clients/employers
              </li>
              <li className="tracking-[0.08px]">
                Credibility: Specific achievements with quantifiable results
                (numbers, percentages, metrics)
              </li>
            </ul>
            <p className="tracking-[0.08px]">
              A well-balanced bio will establish who you are professionally,
              showcase your technical capabilities, explain the value you
              provide, and validate your expertise with concrete
              accomplishments.
            </p>
          </div>
        ) : (
          <p className="font-[Lato] tracking-[0.08px] text-[#404040]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateProfileTips;
