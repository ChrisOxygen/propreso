import Image from "next/image";
import React from "react";

function AccentTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center gap-[8.07px] rounded-[79.31px] bg-[#BF4008]/10 py-1 pr-3 pl-1 sm:gap-2 sm:rounded-full sm:py-2 sm:pr-4 sm:pl-2">
      <div className="relative flex aspect-square h-[21px] w-[21px] items-center justify-center rounded-[19.266px] bg-[#BF4008] sm:h-8 sm:w-8 sm:rounded-full">
        <Image
          src="/assets/site-icon-white.svg"
          alt="Hero Icon"
          width={11}
          height={15}
          className="absolute top-1/2 left-1/2 h-[11px] w-[8px] -translate-x-1/2 -translate-y-1/2 sm:h-[15px] sm:w-[11px]"
        />
      </div>
      <span className="justify-start font-['Lato'] text-[10px] leading-[24.21px] font-normal tracking-[0.05px] text-[#BF4008] sm:text-center sm:text-2xl sm:leading-none sm:tracking-wider">
        {title}
      </span>
    </div>
  );
}

export default AccentTitle;
