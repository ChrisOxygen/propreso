import React from "react";
import JobDetailsSection from "./create-proposal/JobDetailsSection";
import ProposalEditor from "./create-proposal/proposalEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useSearchParams, usePathname } from "next/navigation";

function ProposalForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const jobKey = searchParams.get("jobKey");

  // Check if the current path includes "/edit" to determine if we're in edit mode
  const isEditMode = pathname.includes("/edit");

  // Set title and description based on mode
  const title = isEditMode ? "Edit This Proposal" : "Create A Proposal";
  const description = isEditMode
    ? "Update your existing proposal to improve its effectiveness and address client needs."
    : "Create a proposal from your job details. You can edit and customize it as needed.";

  return (
    <main className="w-full h-full @container">
      <div className="h-full w-full rounded-lg hidden bg-gray-50 p-3 @[800px]:grid grid-cols-3">
        <div className=" py-4 pr-4">
          {}
          <JobDetailsSection jobKey={jobKey!} />
        </div>
        <div className=" col-span-2 bg-white rounded-lg flex flex-col gap-4 p-4">
          <div className="flex items-end justify-between">
            <div className="">
              <h1 className="text-xl font-bold text-black">{title}</h1>
              <p className="text-zinc-500 text-sm tracking-wide">
                {description}
              </p>
            </div>
          </div>
          <ProposalEditor jobKey={jobKey!} />
        </div>
      </div>
      <div className="h-full w-full @[800px]:hidden block">
        <Tabs defaultValue="job-details" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="job-details">Job Details</TabsTrigger>
            <TabsTrigger value="proposal">Proposal</TabsTrigger>
          </TabsList>
          <TabsContent value="job-details">
            <div className="p-2 w-full h-full">
              <JobDetailsSection jobKey={jobKey!} />
            </div>
          </TabsContent>
          <TabsContent value="proposal">
            <div className=" h-full bg-white rounded-lg flex flex-col gap-4 p-2">
              <div className="flex items-end justify-between">
                <div className="">
                  <h1 className="text-xl font-bold text-black">{title}</h1>
                  <p className="text-zinc-500 text-sm tracking-wide">
                    {description}
                  </p>
                </div>
              </div>
              <ProposalEditor jobKey={jobKey!} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default ProposalForm;
