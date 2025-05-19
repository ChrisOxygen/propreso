import PricingCard from "./PricingCard";
import SectionTitleAndDesc from "./SectionTitleAndDesc";

function PricingSection() {
  return (
    <section className="full-width-container">
      <div className="content-box flex flex-col items-center gap-[76px]">
        <SectionTitleAndDesc
          accentTitle="Pricing"
          title="Simple Pricing for every Proposal"
          desc="Start for free. Upgrade anytime as you grow."
        />
        <div className="flex w-full flex-col items-center justify-center gap-[24px] md:flex-row">
          <PricingCard />
          <PricingCard />
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
