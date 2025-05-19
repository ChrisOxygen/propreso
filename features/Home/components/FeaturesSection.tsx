import Image from "next/image";
import { EXTERNAL_FEATURES_DETAILS } from "../constants";
import SectionTitleAndDesc from "./SectionTitleAndDesc";

function FeaturesSection() {
  return (
    <section className="full-width-container pt-[40px] sm:pt-[40px] md:pt-[200px] lg:pt-[400px]">
      <div className="content-box flex flex-col items-center gap-[42px] sm:gap-[76px]">
        <SectionTitleAndDesc
          accentTitle="Features Highlights"
          title="Everything You Need to a winning Proposals."
          desc="Automate repetitive tasks, personalize proposals instantly, and impress clients with AI-powered precision."
        />
        <div className="flex w-full flex-col items-center justify-between gap-10 lg:flex-row lg:gap-[14px]">
          {EXTERNAL_FEATURES_DETAILS.map((feature, index) => (
            <div
              key={index}
              className="flex max-w-[584px] flex-col items-center gap-[10px] rounded-3xl bg-black/4 p-6"
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={350}
                height={328}
                className="mb-2"
              />
              <div className="flex flex-col">
                <h3 className="font-['Poppins'] text-[21.106px] font-semibold tracking-[-0.211px] text-[#2C2C2C]">
                  {feature.title}
                </h3>
                <p className="font-['Lato'] text-[14.07px] leading-[21.106px] font-normal tracking-[0.07px] text-[#404040]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
