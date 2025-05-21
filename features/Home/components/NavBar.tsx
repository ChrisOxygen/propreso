import Link from "next/link";

import SiteLogo from "@/components/SiteLogo";
import NavMenu from "./NavMenu";
import { MobileMenuSheet } from "./MobileMenuSheet";

function NavBar() {
  return (
    <>
      <nav className="full-width-container fixed z-50 hidden h-[133px] md:block">
        <div className="content-box mt-[49px] flex w-full items-center justify-center gap-11 rounded-2xl bg-white/75 p-4 shadow-lg backdrop-blur-lg">
          <div className="">
            <SiteLogo />
          </div>
          <div className="mx-auto hidden md:block">
            <NavMenu />
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/signup"
              className="font-['Lato'] text-lg font-medium text-black"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#BF4008] px-6 py-3.5 font-['Lato'] text-lg font-medium text-white"
            >
              Log In
            </Link>
          </div>
        </div>
      </nav>

      <nav className="fixed z-50 w-full md:hidden">
        <div className="flex w-full items-center justify-between bg-white/75 p-4 shadow backdrop-blur-lg">
          <div className="">
            <SiteLogo />
          </div>
          <div className="">
            <MobileMenuSheet />
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
