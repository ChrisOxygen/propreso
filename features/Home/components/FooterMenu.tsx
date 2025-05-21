"use client";

import clsx from "clsx";
import { EXTERNAL_NAV_LINKS } from "../constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "../services";

function FooterMenu() {
  const pathname = usePathname();
  return (
    <menu className="flex items-center justify-start gap-5 sm:gap-6">
      {EXTERNAL_NAV_LINKS.map((link) => (
        <Link
          key={link.title}
          href={link.href}
          className={clsx(
            "font-[Lato] text-[14px] leading-[28.822px] font-semibold tracking-[0.07px] transition-colors duration-200 hover:text-white sm:text-xl sm:leading-relaxed sm:tracking-wide",
            isActivePath(pathname, link.href)
              ? "text-white"
              : "text-[#ffffff]/50",
          )}
        >
          {link.title}
        </Link>
      ))}
    </menu>
  );
}

export default FooterMenu;
