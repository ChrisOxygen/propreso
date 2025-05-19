import Image from "next/image";
import Link from "next/link";

function MainCTASection() {
  return (
    <section className=" ">
      <div className="full-width-container">
        <div className="content-box relative flex flex-col items-center gap-[76px]">
          <div className="flex w-[623px] flex-col items-center gap-[27px] sm:gap-[17px]">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <h2 className="max-w-[320px] text-center font-[Poppins] text-[28px] font-semibold tracking-[-1.12px] text-[#2C2C2C] sm:max-w-md sm:text-4xl sm:leading-normal sm:tracking-tighter">
                Trusted by Freelancers around the World
              </h2>
              <span className="max-w-[320px] text-center font-[Lato] text-[16px] leading-[24px] font-normal tracking-[0.08px] text-[#2C2C2C]">
                Propreso is built to support your success, every step of the
                way.
              </span>
            </div>
            <div className="flex items-center gap-5">
              <Link
                href="/"
                className="flex items-center justify-center gap-2.5 rounded-lg bg-[#BF4008] px-3.5 py-2.5 font-[Lato] text-sm font-medium tracking-[0.28px] text-white transition-colors duration-200 hover:bg-[#BF4008]/80 sm:px-6 sm:py-3.5 sm:text-xl sm:tracking-normal"
              >
                Get started for free
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2.5 rounded-lg border border-[#BF4008] px-3.5 py-2.5 font-[Lato] text-sm font-medium tracking-[0.28px] text-[#BF4008] transition-colors duration-200 hover:bg-[#BF4008]/10 sm:px-6 sm:py-3.5 sm:text-xl sm:tracking-normal"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Image
        src="/assets/freelancer-at-bottom.webp"
        alt="Description of image"
        width={4000}
        height={4000}
        className="object-cover sm:-mt-[120px] sm:-mb-[120px]"
      />
    </section>
  );
}

export default MainCTASection;
