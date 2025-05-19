import Link from "next/link";
import { EXTERNAL_NAV_LINKS } from "../constants";

function NavMenu() {
  return (
    <div className="">
      <menu className="flex justify-start items-center gap-6">
        {EXTERNAL_NAV_LINKS.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className=" text-black text-base font-normal font-['Lato'] leading-loose tracking-tight hover:text-[#BF4008] transition-colors duration-200"
          >
            {link.title}
          </Link>
        ))}
      </menu>
    </div>
  );
}

export default NavMenu;
