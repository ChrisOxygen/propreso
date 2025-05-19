import Image from "next/image";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { cn } from "@/lib/utils";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import {
  EXTERNAL_PLATFORMS_DETAILS,
  EXTERNAL_WORKFLOW_STEPS,
} from "../constants";

function WorkflowSection() {
  return (
    <section className="full-width-container relative bg-[#BF4008] py-[55px] sm:py-[71px]">
      <div
        className={cn(
          "absolute inset-0 opacity-10",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      ></div>
      <div className="content-box relative z-10 flex w-full flex-col items-center gap-[42px] sm:gap-[50px] lg:gap-[92px]">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="flex items-center justify-center gap-2 rounded-[79.31px] bg-[#AC3907] py-1 pr-3 pl-1 sm:justify-start sm:rounded-[78.62px] sm:py-1.5 sm:pr-4 sm:pl-1.5">
            <div className="relative aspect-square h-[21px] w-[21px] items-center justify-center rounded-3xl bg-white sm:h-7 sm:w-7">
              <Image
                src="/assets/propreso-icon-accent-primary.svg"
                alt="Hero Icon"
                width={11}
                height={15}
                className="absolute top-1/2 left-1/2 h-[11px] w-[8px] -translate-x-1/2 -translate-y-1/2 sm:h-[15px] sm:w-[11px]"
              />
            </div>
            <span className="justify-start font-['Lato'] text-[10px] leading-[24.21px] font-normal tracking-[0.05px] text-white sm:text-sm sm:leading-normal sm:tracking-tight">
              How It Works
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h2 className="max-w-[298px] text-center font-[Poppins] text-[20px] leading-[31px] font-semibold tracking-[-0.4px] text-white sm:max-w-[594px] sm:text-[40px] sm:leading-[48px] sm:tracking-[-0.8px]">
              From Job Post to Proposal,Done in Minutes
            </h2>
            <span className="w-full max-w-[462px] justify-start text-center font-['Lato'] text-base leading-[22px] font-normal tracking-[0.08px] text-white sm:leading-normal sm:tracking-tight">
              See how Propreso simplifies every step: Import jobs, generate
              tailored proposals, and send with confidence, all in just a few
              clicks.
            </span>
          </div>
        </div>
        <div className="relative flex w-full flex-col gap-6 sm:gap-[63px]">
          <div className="flex flex-col-reverse items-center justify-between gap-[32px] sm:gap-[50px] lg:flex-row">
            <menu className="flex w-full flex-col items-start justify-start gap-[23px] sm:items-center sm:gap-9 lg:items-start">
              {EXTERNAL_WORKFLOW_STEPS.map((item, index) => (
                <li
                  key={index}
                  className="flex w-full max-w-[490px] items-center gap-5 sm:gap-7"
                >
                  <span className="grid size-[38px] shrink-0 place-items-center rounded-full bg-black/22 text-lg text-white sm:size-[55px] sm:text-3xl">
                    <IoMdCheckmarkCircleOutline />
                  </span>
                  <div className="flex flex-col items-start gap-[11px] sm:gap-4">
                    <h5 className="font-[Poppins] text-base font-medium tracking-[-0.48px] text-white sm:text-2xl sm:tracking-[-0.72px]">
                      {item.title}
                    </h5>
                    <span className="max-w-[216.633px] font-[Lato] text-sm leading-[16.935px] font-normal tracking-[0.07px] text-white sm:max-w-[307px] sm:text-base sm:leading-6 sm:tracking-[0.08px]">
                      {item.description}
                    </span>
                  </div>
                </li>
              ))}
            </menu>
            <Image
              src="/assets/how-it-works-img.png"
              alt="Hero Icon"
              width={521}
              height={512}
              className="h-full max-h-[343px] w-full max-w-[351px] object-cover object-center sm:max-h-[512px] sm:max-w-[521px]"
            />
          </div>
          <div className="relative">
            <InfiniteMovingCards
              items={EXTERNAL_PLATFORMS_DETAILS}
              direction="right"
              speed="slow"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkflowSection;
