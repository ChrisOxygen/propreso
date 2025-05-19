import Image from "next/image";
import Link from "next/link";

function HeroSection() {
  return (
    <header className="full-width-container relative h-full bg-[url('/assets/mobile-hero-bg.jpg')] bg-cover sm:h-[900px] sm:bg-[url('/assets/hero-bg-desktop.jpg')] md:h-[1100px]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#BF4008]/5"></div>
      <div className="content-box relative z-10 grid grid-rows-[40px_1fr] gap-[70px] md:grid-rows-[133px_1fr] md:gap-[142px]">
        <div className="row-start-2 flex flex-col gap-[60px]">
          <div className="flex flex-col items-center gap-6">
            <div className="flex w-max items-center justify-center gap-[7.733px] rounded-full bg-[#BF4008]/10 py-[9.28px] pr-[18.559px] pl-[9.28px] sm:gap-2.5 sm:py-3 sm:pr-6 sm:pl-3">
              <Image
                src="/assets/propreso-icon-accent-primary.svg"
                alt="Hero Icon"
                width={11}
                height={15}
              />
              <span className="justify-start font-['Lato'] text-[10px] font-medium text-[#BF4008] sm:text-sm">
                Generate AI written Proposal
              </span>
            </div>
            <h1 className="max-w-[321px] text-center font-['Poppins'] text-[32px] leading-[41px] font-semibold tracking-[-0.96px] text-[#151111] sm:max-w-[641px] sm:text-[60px] sm:leading-[73px] md:max-w-[741px] md:text-[70px]">
              Craft Winning Proposals in Minutes
            </h1>
            <span className="w-[321px] text-center font-['Lato'] text-base leading-6 font-normal tracking-[0.08px] text-[#404040] sm:w-96 sm:leading-normal sm:tracking-tight">
              Spend less time writing and more time landing clients. Let
              Propreso streamline your proposal journey.
            </span>
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2.5 rounded-lg bg-[#BF4008] px-3.5 py-2.5 font-['Lato'] text-sm font-medium tracking-[0.28px] text-white"
            >
              Get started for free
            </Link>
          </div>
          <div className="-mb-20 rounded-[15.053px] border-[0.213px] border-white bg-[linear-gradient(246deg,#FFCEB8_6.22%,rgba(213,213,213,0.32)_15.06%),linear-gradient(116deg,#FFCEB8_10.94%,rgba(213,213,213,0.32)_15.69%)] p-1.5 backdrop-blur-[21.262428283691406px] sm:-mb-0">
            <Image
              src="/assets/propreso-dashboard.png"
              alt="Propreso dashboard"
              className="mx-auto rounded-[9px]"
              width={1500}
              height={1500}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeroSection;
