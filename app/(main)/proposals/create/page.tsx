"use client";

// import { useSearchParams } from "next/navigation";
import JobDetailsSection from "@/features/proposals/components/create-proposal/JobDetailsSection";
import { ProposalProvider } from "@/features/proposals/context/ProposalContext";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
import ProposalEditor from "@/features/proposals/components/create-proposal/proposalEditor";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CreateProposalPage() {
  // const searchParams = useSearchParams();
  // const jobId = searchParams.get("jobDetailsId");

  return (
    <ProposalProvider>
      <main className="w-full h-full @container">
        <div className="h-full w-full rounded-lg hidden bg-gray-50 p-3 @[800px]:grid grid-cols-3">
          <div className=" py-4 pr-4">
            <JobDetailsSection />
          </div>
          <div className=" col-span-2 bg-white rounded-lg flex flex-col gap-4 p-4">
            <div className="flex items-end justify-between">
              <div className="">
                <h1 className="text-xl font-bold text-black">
                  Create A Proposals
                </h1>
                <p className="text-zinc-500 text-sm tracking-wide">
                  Create a proposal from your job details. You can edit and
                  customize it as needed.
                </p>
              </div>
              {/* <Link href="/proposals/create">
              <Button className="bg-black text-white hover:bg-zinc-800 shadow cursor-pointer hover:shadow-md w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                view all proposals
              </Button>
            </Link> */}
            </div>
            <ProposalEditor />
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
                <JobDetailsSection />
              </div>
            </TabsContent>
            <TabsContent value="proposal">
              <div className=" h-full bg-white rounded-lg flex flex-col gap-4 p-2">
                <div className="flex items-end justify-between">
                  <div className="">
                    <h1 className="text-xl font-bold text-black">
                      Create A Proposals
                    </h1>
                    <p className="text-zinc-500 text-sm tracking-wide">
                      Create a proposal from your job details. You can edit and
                      customize it as needed.
                    </p>
                  </div>
                  {/* <Link href="/proposals/create">
              <Button className="bg-black text-white hover:bg-zinc-800 shadow cursor-pointer hover:shadow-md w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                view all proposals
              </Button>
            </Link> */}
                </div>
                <ProposalEditor />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ProposalProvider>
  );
}

export default CreateProposalPage;
