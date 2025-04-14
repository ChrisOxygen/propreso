import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SupportPage() {
  return (
    <div className="container mx-auto h-full grid place-items-center max-w-4xl py-12 px-4">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Support</h1>

        <p className="text-muted-foreground max-w-lg">
          We&apos;re currently working on building our support center to better
          assist you. Please check back soon as we&apos;re actively developing
          this section to improve your experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button asChild variant="outline">
            <Link href="/proposals">Go to Dashboard</Link>
          </Button>

          <Button asChild>
            <Link href="/proposals/create">Create Proposal</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
