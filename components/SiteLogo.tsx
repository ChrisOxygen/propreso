import Image from "next/image";
import Link from "next/link";

function SiteLogo() {
  return (
    <Link
      href="/"
      className="flex justify-center items-center gap-[5px] sm:gap-3"
    >
      <div className=" rounded-full relative size-[17px]  sm:size-[35px] grid place-items-center bg-[#BF4008] p-2.5">
        <Image
          src="/assets/site-icon-white.svg"
          alt="Hero Icon"
          width={14}
          height={19}
          className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] sm:w-[14px] sm:h-[19px] h-[9px]"
        />
      </div>
      <span className="text-black text-xs sm:text-3xl font-semibold font-['IBM_Plex_Mono']">
        Propreso
      </span>
    </Link>
  );
}

export default SiteLogo;
