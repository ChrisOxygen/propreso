"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileBio } from "./ProfileBio";
import { ProfileProjects } from "./ProfileProjects";
import { useDashboardActions } from "../../hooks/useDashboardActions";

import ProfileCompleteness from "../profile/ProfileCompleteness";

export function DashboardProfileSection() {
  const {
    activeProfile,
    expandBio,
    profilesLoading,
    error,
    toggleBioExpand,
    handleEditBio,
    handleEditProject,
  } = useDashboardActions();

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-4">Error fetching profiles</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-black text-white hover:bg-gray-800"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (profilesLoading || !activeProfile) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-6" />
      </div>
    );
  }

  const { bio, projects } = activeProfile;

  console.log(
    "Active Profile bio----------------------------------",
    activeProfile
  );

  return (
    <section className="lg:grid flex max-w-[500px] lg:max-w-full  flex-col lg:grid-cols-[minmax(320px,400px)_minmax(300px,1fr)] h-full">
      <div className=" w-full px-5 justify-items-stretch py-10 lg:py-0 flex flex-col items-center lg:items-start   lg:pt-5 border-b lg:border-b-0 lg:border-r">
        <h2 className="font-bold text-xl mb-6">Your Profiles</h2>

        <ProfileCompleteness percentage={50} />
      </div>

      <div className="flex-1 w-full bg-white overflow-y-auto pt-14 lg:pt-0">
        <div className="p-6">
          <ProfileBio />
          <Separator className="mb-6" />
          <ProfileProjects
            projects={projects}
            onEditProject={handleEditProject}
          />
        </div>
      </div>
    </section>
  );
}

export default DashboardProfileSection;
