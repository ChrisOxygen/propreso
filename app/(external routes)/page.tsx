import FaqSection from "@/features/Home/components/FaqSection";
import FeaturesSection from "@/features/Home/components/FeaturesSection";
import HeroSection from "@/features/Home/components/HeroSection";
import MainCTASection from "@/features/Home/components/MainCTASection";
import PricingSection from "@/features/Home/components/PricingSection";
import TargetAudienceSection from "@/features/Home/components/TargetAudienceSection";
import TestimonialSection from "@/features/Home/components/TestimonialSection";
import WorkflowSection from "@/features/Home/components/WorkflowSection";

export default function Home() {
  return (
    <div className="flex flex-col gap-[70px] sm:gap-[100px]">
      <HeroSection />
      <FeaturesSection />
      <TargetAudienceSection />
      <WorkflowSection />
      <PricingSection />
      <TestimonialSection />
      <FaqSection />
      <MainCTASection />
    </div>
  );
}
