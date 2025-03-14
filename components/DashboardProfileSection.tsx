"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FiEdit, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserProfiles } from "@/hooks/user-profile-hooks/useUserProfiles";
import { useProfile } from "@/hooks/user-profile-hooks/useProfile";

function DashboardProfileSection() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const [expandBio, setExpandBio] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Fetch all profiles
  const {
    data: profiles,
    isLoading: profilesLoading,
    error,
    isSuccess: profilesFetchSuccessful,
  } = useUserProfiles();

  // Fetch selected profile details
  const { data: selectedProfileDetails, isLoading: profileDetailsLoading } =
    useProfile(selectedProfileId);

  if (profilesFetchSuccessful) {
    if (!selectedProfileId && profiles?.length > 0) {
      const defaultProfile = profiles.find((p) => p.isDefault) || profiles[0];
      setSelectedProfileId(defaultProfile.id);
    }
  }

  const handleEditTitle = () => {
    console.log("Edit title");
  };

  const handleEditBio = () => {
    console.log("Edit bio");
  };

  const handleEditProject = (projectId: string) => {
    console.log(`Edit project ${projectId}`);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

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

  const renderBio = (bio: string) => {
    if (!bio) return <p className="text-gray-500 italic">No bio available</p>;

    const shortBio =
      bio.length > 150 && !expandBio ? bio.substring(0, 150) + "..." : bio;

    return (
      <div>
        <p className="text-gray-700">{shortBio}</p>
        {bio.length > 150 && (
          <Button
            variant="link"
            onClick={() => setExpandBio(!expandBio)}
            className="p-0 h-auto text-black mt-1"
          >
            {expandBio ? "Read less" : "Read more"}
          </Button>
        )}
      </div>
    );
  };

  const renderProfileList = () => {
    if (profilesLoading) {
      return Array(2)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="mb-3">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ));
    }

    if (profiles?.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">No profiles yet</p>
          <Link href="/dashboard/create-profile">
            <Button className="bg-black text-white hover:bg-gray-800">
              Create Profile
            </Button>
          </Link>
        </div>
      );
    }

    return profiles?.map((profile) => (
      <Card
        key={profile.id}
        className={`mb-3 cursor-pointer hover:border-gray-400 transition-colors ${
          profile.id === selectedProfileId ? "border-black" : ""
        }`}
        onClick={() => {
          setSelectedProfileId(profile.id);
          // On mobile, close the sidebar when a profile is selected
          if (window.innerWidth < 1024) {
            setShowSidebar(false);
          }
        }}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{profile?.jobTitle}</h3>
            </div>
            {profile.isDefault && (
              <Badge variant="outline" className="bg-black text-white">
                Default
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderProfileDetails = () => {
    if (profileDetailsLoading) {
      return (
        <div className="p-6">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />

          <Skeleton className="h-6 w-1/4 mb-3" />
          <Skeleton className="h-32 w-full mb-6 rounded-md" />

          <Skeleton className="h-6 w-1/3 mb-3" />
          <Skeleton className="h-24 w-full mb-2 rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      );
    }

    if (!selectedProfileDetails) {
      return (
        <div className="p-6 text-center">
          <p className="text-gray-500 mb-4">No profile selected</p>
          <Link href="/dashboard/create-profile">
            <Button className="bg-black hover:bg-gray-800 text-white">
              Create Your First Profile
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">
              {selectedProfileDetails.jobTitle}
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleEditTitle}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <FiEdit size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit profile title</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedProfileDetails.skills?.map((skill) => (
              <Badge key={skill} variant="outline" className="border-black">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Professional Bio</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleEditBio}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <FiEdit size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit professional bio</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {renderBio(selectedProfileDetails.bio)}
        </div>

        <Separator className="mb-6" />

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Projects</h3>
            <Link href="/dashboard/add-project">
              <Button
                variant="outline"
                size="sm"
                className="border-black text-black hover:bg-gray-100"
              >
                <FiPlus size={16} className="mr-1" />
                Add Project
              </Button>
            </Link>
          </div>

          {selectedProfileDetails.projects?.length > 0 ? (
            <div className="space-y-4">
              {selectedProfileDetails.projects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden border-gray-200"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium mb-1">{project.title}</h4>
                        <p className="text-sm text-gray-700">
                          {project.description}
                        </p>

                        <div className="flex gap-4 mt-2">
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-black font-medium hover:underline"
                            >
                              Live Demo
                            </a>
                          )}
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-black font-medium hover:underline"
                            >
                              GitHub Repo
                            </a>
                          )}
                        </div>
                      </div>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleEditProject(project.id)}
                              className="text-gray-500 hover:text-black transition-colors"
                            >
                              <FiEdit size={18} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit project</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">No projects added yet</p>
              <Link href="/dashboard/add-project">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-black text-black hover:bg-gray-100"
                >
                  Add Your First Project
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="flex h-full">
      {/* Mobile toggle for profile list */}
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

      {/* Profile list sidebar - responsive */}
      <div
        className={`${
          showSidebar ? "fixed inset-0 z-20 bg-black bg-opacity-40" : "hidden"
        } lg:block lg:static lg:bg-transparent lg:z-auto`}
        onClick={() => setShowSidebar(false)}
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
          {renderProfileList()}
        </div>
      </div>

      {/* Main content area - full width on mobile, adjusted on desktop */}
      <div className="flex-1 w-full bg-white overflow-y-auto pt-14 lg:pt-0">
        {renderProfileDetails()}
      </div>
    </section>
  );
}

export default DashboardProfileSection;
