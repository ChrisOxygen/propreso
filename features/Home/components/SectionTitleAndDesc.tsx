import React from "react";
import AccentTitle from "./AccentTitle";

type SectionTitleAndDescProps = {
  accentTitle: string;
  title: string;
  desc?: string;
};

function SectionTitleAndDesc({
  accentTitle,
  title,
  desc,
}: SectionTitleAndDescProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-7">
      <AccentTitle title={accentTitle} />

      <div className="flex flex-col items-center gap-[11px] sm:gap-4">
        <h2 className="w-full max-w-[278px] justify-start text-center font-['Poppins'] text-xl leading-[30px] font-semibold tracking-[-0.4px] text-[#2C2C2C] sm:max-w-lg sm:text-center sm:font-sans sm:text-5xl sm:leading-tight sm:font-semibold sm:tracking-tighter sm:text-gray-900">
          {title}
        </h2>
        {desc && (
          <span className="w-full max-w-[278px] justify-start text-center font-['Lato'] text-base leading-5 font-normal tracking-[0.08px] sm:max-w-xl sm:leading-6 sm:text-gray-900">
            {desc}
          </span>
        )}
      </div>
    </div>
  );
}

export default SectionTitleAndDesc;
