"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { RiMenu3Line } from "react-icons/ri";
import { EXTERNAL_NAV_LINKS } from "../constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { isActivePath } from "../services";

export function MobileMenuSheet() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="">
          <span className="text-xl transition-all duration-300 hover:text-[#BF4008]">
            <RiMenu3Line />
          </span>
        </button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col justify-between gap-8 bg-[#FCF5EE]">
        <SheetHeader>
          <SheetTitle className="hidden">Menu</SheetTitle>
          <SheetDescription className="hidden">
            Navigation links.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex h-[60%] flex-col items-center justify-center gap-5">
          {EXTERNAL_NAV_LINKS.map((link) => (
            <SheetClose asChild key={link.title}>
              <Link
                href={link.href}
                className={clsx(
                  "font-[Lato] text-xl leading-relaxed font-semibold tracking-wide transition-colors duration-200 hover:text-white",
                  isActivePath(pathname, link.href)
                    ? "text-[#BF4008]"
                    : "text-black",
                )}
              >
                {link.title}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <SheetFooter>
          <div className="flex flex-col items-center gap-5">
            <SheetClose asChild>
              <Link
                href="/signup"
                className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#BF4008] px-3.5 py-2.5 font-[Lato] text-sm font-medium tracking-[0.28px] text-white transition-colors duration-200 hover:bg-[#BF4008]/80 sm:px-6 sm:py-3.5 sm:text-xl sm:tracking-normal"
              >
                Get started for free
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#BF4008] px-3.5 py-2.5 font-[Lato] text-sm font-medium tracking-[0.28px] text-[#BF4008] transition-colors duration-200 hover:bg-[#BF4008]/10 sm:px-6 sm:py-3.5 sm:text-xl sm:tracking-normal"
              >
                Log in
              </Link>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
