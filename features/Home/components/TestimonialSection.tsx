import { ImQuotesLeft } from "react-icons/im";

function TestimonialSection() {
  return (
    <section className=" full-width-container">
      <div className="content-box flex flex-col">
        <div className="flex flex-col items-center gap-[17px] sm:gap-[27px] self-stretch">
          <span className="md:text-[150px] text-[60px] italic text-[#BF4008]/70">
            <ImQuotesLeft />
          </span>
          <span className="text-[#2C2C2C]/60 text-center font-[Lato] text-[24px] sm:text-[40px] lg:text-[50px] font-semibold  italic">
            ‘‘Propreso has completely changed the way I apply for freelance
            jobs. What used to take me an hour now takes minutes and the
            proposals are actually better. I landed three gigs in my first week
            using it.’’
          </span>
          <div className=" flex flex-col items-center">
            <span className="text-[#2C2C2C] text-center font-[Lato] text-[24px] font-semibold leading-[24px]">
              Maya O
            </span>
            <span className="text-[#404040] text-center font-[Lato] text-[16px] font-normal leading-[24px]">
              UI Designer
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
