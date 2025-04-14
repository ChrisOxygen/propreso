// This should be placed in a new file at: app/(main)/referral/page.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ReferralsPage() {
  return (
    <div className="container mx-auto h-full grid place-items-center max-w-4xl py-12 px-4">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Referral</h1>

        <p className="text-muted-foreground max-w-lg">
          We&apos;re currently working on our referral program to help you share
          Propreso with others. Please check back soon as we&apos;re actively
          developing this feature for you.
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

export default ReferralsPage;
