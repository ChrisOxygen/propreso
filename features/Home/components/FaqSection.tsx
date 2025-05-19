import { EXTERNAL_FAQS } from "../constants";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/customizedAccordion";
import SectionTitleAndDesc from "./SectionTitleAndDesc";

function FaqSection() {
  return (
    <section className="full-width-container">
      <div className="content-box flex flex-col items-center gap-[42px] sm:gap-[76px]">
        <SectionTitleAndDesc
          accentTitle="FAQ"
          title="Frequently Asked Questions"
        />
        <div className="w-full">
          <Accordion
            type="multiple"
            className="flex w-full flex-col items-start gap-[26px] self-stretch sm:gap-9"
          >
            {EXTERNAL_FAQS.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                className="flex w-full flex-col items-start gap-2.5 self-stretch rounded-md bg-white px-3 py-3.5 shadow-[0px_8px_12px_-4px_rgba(191,64,8,0.08)] sm:px-[27px] sm:py-5"
                value={`item-${index}`}
              >
                <AccordionTrigger className="text-left font-[Poppins] text-[18px] leading-6 font-semibold text-[#2C2C2C] sm:text-xl">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="w-full border-t border-[#96939375] pt-[34px] font-[Lato] text-base leading-6 font-normal tracking-[0.08px] text-[#404040]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
