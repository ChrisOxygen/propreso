import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const DashboardHeader = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="mb-1 font-[Poppins] text-2xl font-semibold tracking-[-0.72px] text-[#2C2C2C] md:mb-2 md:text-3xl">
          Proposals
        </h1>
        <p className="font-[Lato] text-sm font-normal tracking-[0.08px] text-[#404040]">
          Track, analyze and optimize your proposal performance
        </p>
      </div>
      <Link href="/proposals/create">
        <Button className="w-full bg-[#BF4008] font-[Lato] text-base font-medium tracking-[0.28px] text-white shadow transition-colors duration-200 hover:bg-[#BF4008]/80 md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Proposal
        </Button>
      </Link>
    </div>
  );
};

export default DashboardHeader;
