"use client";

import Link from "next/link";
import { EXTERNAL_NAV_LINKS } from "../constants";
import { usePathname } from "next/navigation";
import { isActivePath } from "../services";
import clsx from "clsx";

function NavMenu() {
  const pathname = usePathname();
  return (
    <div className="">
      <menu className="flex items-center justify-start gap-6">
        {EXTERNAL_NAV_LINKS.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className={clsx(
              "font-['Lato'] text-base leading-loose font-normal tracking-tight transition-colors duration-200 hover:text-[#BF4008]",
              isActivePath(pathname, link.href)
                ? "text-[#BF4008]"
                : "text-black",
            )}
          >
            {link.title}
          </Link>
        ))}
      </menu>
    </div>
  );
}

export default NavMenu;
