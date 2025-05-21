import Link from "next/link";

function NoProfile() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="max-w-lg rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <h3 className="mb-3 font-[Poppins] text-3xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
          Complete Your Profile
        </h3>
        <p className="mb-6 font-[Lato] tracking-[0.08px] text-[#404040]">
          Please create your profile to help our AI assistant understand your
          needs and generate more accurate information for you.
        </p>
        <Link
          href="/create-profile"
          className="inline-block w-full rounded-md bg-[#BF4008] px-4 py-3 font-[Lato] font-medium text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
        >
          Create Profile
        </Link>
      </div>
    </div>
  );
}

export default NoProfile;
