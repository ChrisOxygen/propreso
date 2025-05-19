import Image from "next/image";
import SectionTitleAndDesc from "./SectionTitleAndDesc";

function TargetAudienceSection() {
  return (
    <section className="full-width-container">
      <div className="content-box flex flex-col items-center gap-[42px] self-stretch sm:gap-[65px]">
        {/* <div className=" flex flex-col gap-4 sm:gap-7 items-center">
          <AccentTitle title="Who propreso empowers" />
          <h2 className="max-w-[278px] w-full text-center justify-start text-[#2C2C2C] text-xl font-semibold font-['Poppins'] leading-[30px] tracking-[-0.4px]">
            Built for Freelancers, Loved by Doers
          </h2>
        </div> */}
        <SectionTitleAndDesc
          accentTitle="Who propreso empowers"
          title="Built for Freelancers, Loved by Doers"
        />
        <div className="flex flex-col">
          <div className="w-full">
            <Image
              src="/assets/doers-img.jpg"
              alt="Target Audience 1"
              width={1212}
              height={441}
              className="w-full rounded-[18px] object-cover"
            />
          </div>
          <div className="flex flex-col items-start justify-center gap-[38px]">
            <div className="flex w-full flex-col items-center justify-center gap-[15px] sm:-mt-[59px] lg:flex-row">
              <div className="flex w-full max-w-[570px] flex-col items-start gap-[10px] rounded-[6px] bg-white px-[30px] py-[23px] shadow-[0px_4px_7.7px_-4px_rgba(191,64,8,0.08)] lg:max-w-[329px]">
                <h4 className="font-[Poppins] text-[18px] leading-[26px] font-semibold text-[#2C2C2C]">
                  Freelance Writers
                </h4>
                <span className="font-[Lato] text-[16px] leading-[24px] font-normal tracking-[0.08px] text-[#2C2C2C]">
                  Craft compelling proposals that land gigs faster.
                </span>
              </div>
              <div className="flex w-full max-w-[570px] flex-col items-start gap-[10px] rounded-[6px] bg-white px-[30px] py-[23px] shadow-[0px_4px_7.7px_-4px_rgba(191,64,8,0.08)] lg:max-w-[329px]">
                <h4 className="font-[Poppins] text-[18px] leading-[26px] font-semibold text-[#2C2C2C]">
                  UI/UX Designers
                </h4>
                <span className="font-[Lato] text-[16px] leading-[24px] font-normal tracking-[0.08px] text-[#2C2C2C]">
                  Focus on design while Propreso handles the pitch.
                </span>
              </div>
              <div className="flex w-full max-w-[570px] flex-col items-start gap-[10px] rounded-[6px] bg-white px-[30px] py-[23px] shadow-[0px_4px_7.7px_-4px_rgba(191,64,8,0.08)] lg:max-w-[329px]">
                <h4 className="font-[Poppins] text-[18px] leading-[26px] font-semibold text-[#2C2C2C]">
                  Web Developers
                </h4>
                <span className="font-[Lato] text-[16px] leading-[24px] font-normal tracking-[0.08px] text-[#2C2C2C]">
                  Skip the writing block and send polished proposals in minutes.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TargetAudienceSection;
