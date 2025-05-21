import React from "react";
import SectionTitleAndDesc from "../SectionTitleAndDesc";
import Image from "next/image";
import AccentTitle from "../AccentTitle";

function AboutSection() {
  return (
    <section className="full-width-container pt-[40px] sm:pt-[40px]">
      <div className="content-box flex flex-col items-center gap-[42px] sm:gap-[76px]">
        <SectionTitleAndDesc
          accentTitle="Our story"
          title="Built by Freelancers, for Freelancers"
          desc="At Propreso, we’re on a mission to take the stress out of proposal writing. "
        />
        <div className="flex w-full flex-col items-center justify-between gap-[96px] md:flex-row">
          <div className="p-[2px]">
            <Image
              src="/assets/chris.jpg"
              alt="Feature 1"
              width={3120}
              height={4120}
              className="aspect-auto rounded-2xl object-cover object-center"
            />
          </div>
          <div className="flex-start flex flex-col gap-[36px]">
            <div className="w-max">
              <AccentTitle title="Our mission" />
            </div>
            <p className="flex flex-col gap-[16px] text-base leading-6 font-normal tracking-[0.08px] text-[#2C2C2C]">
              <span className="">
                Propreso was born out of frustration with the time-consuming,
                repetitive process of writing proposals. As freelancers
                ourselves, we knew there had to be a better way. So we built a
                tool that not only saves time but improves your chances of
                landing quality clients.
              </span>
              <span className="">
                Founded by <strong className="">Christopher Okafor</strong> , a
                full-stack developer and freelancer who experienced firsthand
                the challenges of proposal writing, Propreso started as a
                late-night idea and grew into a trusted tool used by freelancers
                across the world. Our goal is simple: to help freelancers thrive
                by making proposals effortless.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
