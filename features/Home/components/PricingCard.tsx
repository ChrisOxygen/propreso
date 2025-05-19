import Link from "next/link";
import { BiCheck } from "react-icons/bi";

export const EXTERNAL_PLAN_FEATURES = [
  "Up to 50 proposal tokens",
  "Import jobs from Upwork",
  "AI-powered proposal suggestions",
  "Export proposals as PDF",
  "Access to basic templates",
];

function PricingCard() {
  return (
    <div className="flex w-full max-w-full flex-col gap-[7.795px] rounded-[18.708px] bg-black/4 px-[17.149px] py-[16.37px] sm:max-w-[449px] sm:gap-[10px] sm:rounded-[24px] sm:px-[22px] sm:py-[21px]">
      <div className="flex flex-col items-start justify-center gap-5 self-stretch sm:gap-[26px]">
        <div className="flex h-[194px] flex-col items-center justify-center gap-5 self-stretch rounded-[16px] bg-white/76 p-[27px] sm:h-[249px] sm:gap-[25px]">
          <div className="flex flex-col">
            <span className="text-center font-[IBM_Plex_Mono] text-[18.708px] font-semibold tracking-[-0.748px] text-[#2C2C2C] sm:text-[24px] sm:tracking-[-0.96px]">
              Starter
            </span>
            <span className="text-center font-[Lato] text-[12.472px] leading-[18.708px] font-normal tracking-[0.062px] text-[#404040] sm:text-[16px] sm:leading-[24px] sm:tracking-[0.08px]">
              Perfect for when starting out
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-[IBM_Plex_Mono] text-[31px] leading-[25.109px] font-semibold text-[#2C2C2C] sm:text-[40.688px] sm:leading-[32.211px]">
              ₦0.00
            </span>
            <span className="text-center font-[Lato] text-[14.031px] leading-[18.708px] font-normal tracking-[0.07px] text-[#404040] sm:text-[18px] sm:leading-[24px] sm:tracking-[0.09px]">
              / per month
            </span>
          </div>
        </div>
        <ul className="flex flex-col gap-[9px] sm:mt-[22px] sm:gap-[14px]">
          {EXTERNAL_PLAN_FEATURES.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-[6px] self-stretch sm:gap-[8px]"
            >
              <span className="grid h-[18.708px] w-[18.708px] place-items-center items-center justify-center rounded-full bg-[#BF4008] p-[2.521px_3.472px_3.715px_2.764px] text-[10px] text-white sm:h-[24px] sm:w-[24px] sm:rounded-[100px] sm:px-[4px] sm:pt-[3.688px] sm:pb-[4.312px] sm:text-lg">
                <BiCheck />
              </span>
              <span className="text-center font-[Lato] text-[14px] leading-[18.708px] font-normal tracking-[0.07px] text-[#404040] sm:text-[16px] sm:leading-[24px] sm:tracking-[0.08px]">
                {feature}
              </span>
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-[7.795px] rounded-[10.134px] bg-[#BF4008]/100 p-[10px] font-[Lato] text-[15.59px] font-medium text-[#FFF] transition-colors duration-200 hover:bg-[#BF4008]/80 sm:gap-0 sm:rounded-[13px] sm:p-[14px] sm:text-[20px]"
        >
          sign up
        </Link>
      </div>
    </div>
  );
}

export default PricingCard;
