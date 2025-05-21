import Link from "next/link";

import { BiLogoLinkedinSquare } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import FooterLogo from "@/components/FooterLogo";
import FooterMenu from "./FooterMenu";

function Footer() {
  return (
    <footer className="full-width-container relative z-50 bg-[#BF4008] py-[50px]">
      <div className="content-box flex flex-col gap-[56px]">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-end">
          <div className="flex flex-col items-center gap-3 sm:gap-5 md:items-start">
            <FooterLogo />
            <FooterMenu />
          </div>
          <p className="w-full max-w-[340.602px] text-center font-[Lato] text-[14px] leading-[20px] font-normal tracking-[0.07px] text-[#F8F8F8] sm:text-base sm:leading-6 sm:tracking-wide md:text-left">
            Propreso was born out of frustration with the time-consuming,
            repetitive process of writing proposals.
          </p>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/28 pt-[33px] sm:gap-6 md:flex-row">
          <span className="font-['lato'] text-[14px] leading-[24px] font-normal text-white/70">
            © 2025 Propreso. All rights reserved.
          </span>
          <div className="flex gap-6">
            <Link href="/">
              <span className="text-[18px] text-white/70">
                <BiLogoLinkedinSquare />
              </span>
            </Link>
            <Link href="/">
              <span className="text-[18px] text-white/70">
                <FaXTwitter />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
