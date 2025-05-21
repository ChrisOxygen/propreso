import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

function SupportPage() {
  return (
    <div className="container mx-auto grid h-full max-w-4xl place-items-center px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF9F6]">
          <HelpCircle className="h-8 w-8 text-[#BF4008]" />
        </div>

        <h1 className="font-[Poppins] text-3xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
          Support
        </h1>

        <p className="max-w-lg font-[Lato] tracking-[0.08px] text-[#404040]">
          We&apos;re currently working on building our support center to better
          assist you. Please check back soon as we&apos;re actively developing
          this section to improve your experience.
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Button
            asChild
            variant="outline"
            className="border-zinc-200 bg-white font-[Lato] text-[#2C2C2C] transition-colors duration-200 hover:border-[#BF4008] hover:bg-[#BF4008] hover:text-white"
          >
            <Link href="/proposals">Go to Dashboard</Link>
          </Button>

          <Button
            asChild
            className="bg-[#BF4008] font-[Lato] font-medium text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
          >
            <Link href="/proposals/create">Create Proposal</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
