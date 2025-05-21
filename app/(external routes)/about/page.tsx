import AboutSection from "@/features/Home/components/about-page/AboutSection";
import FaqSection from "@/features/Home/components/FaqSection";
import MainCTASection from "@/features/Home/components/MainCTASection";
import PageHeader from "@/features/Home/components/other-pages/PageHeader";
import TestimonialSection from "@/features/Home/components/TestimonialSection";

function page() {
  return (
    <div className="flex flex-col gap-[70px] sm:gap-[100px]">
      <PageHeader
        pageTitle="About Us"
        pageDescription="We’re building an AI-driven platform to help freelancers land more jobs less effort."
      />
      <AboutSection />
      <TestimonialSection />
      <FaqSection />
      <MainCTASection />
    </div>
  );
}

export default page;
