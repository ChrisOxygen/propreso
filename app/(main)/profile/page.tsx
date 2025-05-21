"use client";

import { useEffect, useState } from "react";
import ProjectCard from "../../../features/profiles/components/ProjectCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProfileTitleAndBio from "@/features/profiles/components/ProfileTitleAndBio";
import { useUserProfiles } from "@/features/profiles/hooks/user-profile-hooks/useUserProfiles";
import InBoxLoader from "@/components/InBoxLoader";
import ProfileSkilllDisplay from "@/features/profiles/components/ProfileSkilllDisplay";
import ProfileStengthDisplay from "@/features/profiles/components/ProfileStengthDisplay";
import AddProject from "@/features/profiles/components/projects/AddProject";
import ProfilePageHeader from "@/features/profiles/components/ProfilePageHeader";

import { Prisma, Project } from "@prisma/client";
import { useSearchParams } from "next/navigation";

// First define the utility type
export type ProfileWithProjects = Prisma.ProfileGetPayload<{
  include: { projects: true };
}>;

function ProfilePage() {
  const [visibleProfile, setVisibleProfile] =
    useState<ProfileWithProjects | null>(null);
  const searchParams = useSearchParams();
  const createdProfileId = searchParams.get("createdProfileId");

  const { data: userProfiles, isPending: gettingUserProfiles } =
    useUserProfiles();

  useEffect(() => {
    if (userProfiles && userProfiles.length > 0) {
      const defaultProfile = userProfiles.find((profile) => profile.isDefault);
      if (createdProfileId) {
        const selectedProfile = userProfiles.find(
          (profile) => profile.id === createdProfileId,
        );
        if (selectedProfile) {
          setVisibleProfile(selectedProfile);
        } else {
          setVisibleProfile(defaultProfile || userProfiles[0]);
        }
      } else {
        setVisibleProfile(defaultProfile || userProfiles[0]);
      }
    }
  }, [userProfiles, createdProfileId]);

  const handleProfileChange = (profileId: string) => {
    const selectedProfile = userProfiles?.find(
      (profile) => profile.id === profileId,
    );

    if (!selectedProfile) {
      console.error("Selected profile not found in user profiles.");
      return;
    }
    setVisibleProfile(selectedProfile);
  };

  if (gettingUserProfiles) {
    return <InBoxLoader />;
  }

  if (!visibleProfile) {
    return (
      <div className="grid h-[50vh] place-items-center">
        <p className="font-[Lato] text-lg tracking-[0.08px] text-[#404040]">
          No profiles available
        </p>
      </div>
    );
  }

  const {
    id,
    bio,
    jobTitle,
    skills,
    profileStength,
    profileStengthMessage,
    projects,
  } = visibleProfile;

  return (
    <div className="@container flex h-full flex-col">
      {/* First Row - Header */}
      <div className="flex min-h-[110px] items-center border-y border-gray-200 py-6 lg:py-0">
        <ProfilePageHeader
          handleProfileChange={handleProfileChange}
          visibleProfile={visibleProfile}
          userProfiles={userProfiles || []}
        />
      </div>

      {/* Second Row - Freelancer Profile */}
      <div className="flex flex-grow flex-col overflow-auto @[800px]:flex-row">
        {/* Left Column */}
        <div className="w-full border-gray-200 @[800px]:w-1/3 @[800px]:border-r">
          <ScrollArea className="h-full max-h-[calc(100vh-200px)] p-6">
            {/* Section 1: Title and Bio */}
            <ProfileTitleAndBio
              jobTitle={jobTitle}
              bio={bio}
              skills={skills}
              profileId={id}
            />

            {/* Section 2: Skills */}
            <div className="mb-8">
              <h2 className="mb-3 font-[Poppins] text-xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
                Skills
              </h2>
              <ProfileSkilllDisplay
                skills={skills}
                profileId={id}
                jobTitle={jobTitle}
              />
            </div>

            {/* Section 3: Profile Completeness */}
            <ProfileStengthDisplay
              profileStength={profileStength}
              profileStengthMessage={profileStengthMessage as string}
            />
          </ScrollArea>
        </div>

        {/* Right Column */}
        <div className="w-full @[800px]:w-2/3">
          {projects.length !== 0 && (
            <ScrollArea className="h-full max-h-full sm:max-h-[calc(100vh-220px)]">
              <div className="@container h-full p-6">
                <h2 className="mb-4 font-[Poppins] text-xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
                  Projects
                </h2>
                <div className="grid grid-cols-2 gap-6 @max-xl:grid-cols-1">
                  {projects.length < 4 && <AddProject profileId={id} />}
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project as Project}
                    />
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
          {projects.length === 0 && (
            <div className="grid h-full min-h-[600px] place-items-center bg-[#FDF9F6] px-8">
              <div className="item-center flex max-w-[500px] flex-col gap-5">
                <h2 className="mb-4 text-center font-[Poppins] text-xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
                  Add Projects
                </h2>
                <AddProject profileId={id} />
                <p className="text-center font-[Lato] tracking-[0.08px] text-[#404040]">
                  Projects boost your profile strength and help AI create
                  detailed, personalized proposals.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
