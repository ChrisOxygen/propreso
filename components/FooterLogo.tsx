import Image from "next/image";
import Link from "next/link";

function FooterLogo() {
  return (
    <Link
      href="/"
      className="flex justify-center items-center gap-[9px] sm:gap-3"
    >
      <div className=" relative flex w-[22.468px] h-[22.468px] justify-center items-center p-[4.947px_6.441px_4.947px_6.596px] aspect-square rounded-[20.613px] bg-white">
        <Image
          src="/assets/propreso-icon-accent-primary.svg"
          alt="Hero Icon"
          width={14}
          height={19}
          className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-[14px] sm:h-[19px] w-[9px] h-[12px]"
        />
      </div>
      <span className="text-white text-[20.575px] font-semibold font-['IBM_Plex_Mono'] tracking-[1.646px]">
        Propreso
      </span>
    </Link>
  );
}

export default FooterLogo;
