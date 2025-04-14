import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function FeedbackPage() {
  return (
    <div className="container h-full grid place-items-center mx-auto max-w-4xl py-12 px-4">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>

        <p className="text-muted-foreground max-w-lg">
          We&#39;re currently working on building this feature to collect your
          valuable feedback. Please check back soon as we&#39;re actively
          developing this section to improve your experience.
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

export default FeedbackPage;
