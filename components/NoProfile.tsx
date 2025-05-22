import Link from "next/link";
import { Button } from "./ui/button";

function NoProfile() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 inline-block rounded-full bg-[#FDF9F6] p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-[#BF4008]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 className="mb-3 font-[Poppins] text-2xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
          Create Your Profile
        </h2>
        <p className="mb-6 font-[Lato] tracking-[0.08px] text-[#404040]">
          Before you can create proposals, you need to set up your professional
          profile. This helps clients understand your expertise and experience.
        </p>
        <Button
          asChild
          className="bg-[#BF4008] font-[Lato] text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
        >
          <Link href="/profile/create">Create Profile</Link>
        </Button>
      </div>
    </div>
  );
}

export default NoProfile;
