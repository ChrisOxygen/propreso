import Link from "next/link";
import PricingCard from "./PricingCard";
import SectionTitleAndDesc from "./SectionTitleAndDesc";

function PricingSection() {
  return (
    <section className="full-width-container" id="pricing">
      <div className="content-box flex flex-col items-center gap-[76px]">
        <SectionTitleAndDesc
          accentTitle="Pricing"
          title="Simple Pricing for every Proposal"
          desc="Start for free. Upgrade anytime as you grow."
        />
        <div className="relative flex w-full flex-col items-center justify-center gap-[24px] md:flex-row">
          <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-6 rounded-2xl border bg-white/60 backdrop-blur-sm">
            <h4 className="text-center font-[Lato] text-4xl font-semibold tracking-[0.07px] text-black">
              Free for
              <br /> first 200 people
            </h4>
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2.5 rounded-lg bg-[#BF4008] px-3.5 py-2.5 font-[Lato] text-sm font-medium tracking-[0.28px] text-white transition-colors duration-200 hover:bg-[#BF4008]/80 sm:px-6 sm:py-3.5 sm:text-xl sm:tracking-normal"
            >
              Get started for free
            </Link>
          </div>
          <PricingCard />
          <PricingCard />
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
