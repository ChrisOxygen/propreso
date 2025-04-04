import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">
          Proposals
        </h1>
        <p className="text-zinc-500 text-sm tracking-wide">
          Track, analyze and optimize your proposal performance
        </p>
      </div>
      <Link href="/proposals/create">
        <Button className="bg-black text-white hover:bg-zinc-800 shadow cursor-pointer hover:shadow-md w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Proposal
        </Button>
      </Link>
    </div>
  );
};

export default DashboardHeader;
