"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileList } from "./ProfileList";
import { ProfileBio } from "./ProfileBio";
import { ProfileProjects } from "./ProfileProjects";
import { useDashboardActions } from "../../hooks/useDashboardActions";
import Link from "next/link";

export function DashboardProfileSection() {
  const {
    selectedProfileId,
    expandBio,
    showSidebar,
    profiles,
    selectedProfileDetails,
    profilesLoading,
    profileDetailsLoading,
    error,
    handleEditBio,
    handleEditProject,
    toggleSidebar,
    handleProfileSelect,
    toggleBioExpand,
  } = useDashboardActions();

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-4">Error fetching profiles</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-black text-white hover:bg-gray-800"
        >
          try again
        </Button>
      </div>
    );
  }

  return (
    <section className="flex h-full">
      <div className="lg:hidden fixed top-4 right-4 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="bg-black text-white border-none"
        >
          {showSidebar ? "Hide Profiles" : "Show Profiles"}
        </Button>
      </div>

      <div
        className={`${
          showSidebar ? "fixed inset-0 z-20 bg-black bg-opacity-40" : "hidden"
        } lg:block lg:static lg:bg-transparent lg:z-auto`}
        onClick={toggleSidebar}
      >
        <div
          className={`${
            showSidebar
              ? "translate-x-0 w-[300px] max-w-[80vw]"
              : "-translate-x-full"
          } fixed z-20 left-0 top-0 h-full overflow-y-auto lg:translate-x-0 lg:static lg:w-64 lg:max-w-[300px] lg:mr-4 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 p-6`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="font-bold text-xl mb-6">Your Profiles</h2>
          <ProfileList
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            isLoading={profilesLoading}
            onProfileSelect={handleProfileSelect}
          />
        </div>
      </div>

      <div className="flex-1 w-full bg-white overflow-y-auto pt-14 lg:pt-0">
        {profileDetailsLoading ? (
          <div className="p-6">
            <Skeleton className="h-8 w-2/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
          </div>
        ) : !selectedProfileDetails ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 mb-4">No profile selected</p>
            <Link href="/dashboard/create-profile">
              <Button className="bg-black hover:bg-gray-800 text-white">
                Create Your First Profile
              </Button>
            </Link>
          </div>
        ) : (
          <div className="p-6">
            <ProfileBio
              bio={selectedProfileDetails.bio}
              expandBio={expandBio}
              onExpandToggle={toggleBioExpand}
              onEdit={handleEditBio}
            />
            <Separator className="mb-6" />
            <ProfileProjects
              projects={selectedProfileDetails.projects}
              onEditProject={handleEditProject}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default DashboardProfileSection;
