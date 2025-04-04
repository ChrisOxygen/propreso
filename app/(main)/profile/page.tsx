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

// First define the utility type
export type ProfileWithProjects = Prisma.ProfileGetPayload<{
  include: { projects: true };
}>;

function ProfilePage() {
  const [visibleProfile, setVisibleProfile] =
    useState<ProfileWithProjects | null>(null);

  const { data: userProfiles, isPending: gettingUserProfiles } =
    useUserProfiles();

  useEffect(() => {
    if (userProfiles && userProfiles.length > 0) {
      const defaultProfile = userProfiles.find((profile) => profile.isDefault);
      setVisibleProfile(defaultProfile || userProfiles[0]);
    }
  }, [userProfiles]);

  const handleProfileChange = (profileId: string) => {
    const selectedProfile = userProfiles?.find(
      (profile) => profile.id === profileId
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
    return <div>No profiles available</div>;
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
    <div className="flex flex-col h-full @container">
      {/* First Row - Empty (min height 200px) */}
      <div className="min-h-[110px] flex items-center lg:py-0 py-6 border-y border-gray-200">
        <ProfilePageHeader
          handleProfileChange={handleProfileChange}
          visibleProfile={visibleProfile}
          userProfiles={userProfiles || []}
        />
      </div>

      {/* Second Row - Freelancer Profile */}
      <div className="flex-grow flex @[800px]:flex-row flex-col overflow-auto">
        {/* Left Column */}
        <div className="@[800px]:w-1/3 w-full  @[800px]:border-r border-gray-200">
          <ScrollArea className="h-full p-6 max-h-[calc(100vh-200px)]">
            {/* Section 1: Title and Bio */}
            <ProfileTitleAndBio
              jobTitle={jobTitle}
              bio={bio}
              skills={skills}
              profileId={id}
            />

            {/* Section 2: Skills */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Skills</h2>
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
              <div className="p-6 h-full @container">
                <h2 className="text-xl font-semibold mb-4">Projects</h2>
                <div className="grid @max-xl:grid-cols-1 grid-cols-2 gap-6 ">
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
            <div className="grid h-full min-h-[600px] px-8 place-items-center bg-gray-50 ">
              <div className="flex flex-col gap-5 item-center max-w-[500px]">
                <h2 className="text-xl font-semibold text-center mb-4">
                  Add Projects
                </h2>
                <AddProject profileId={id} />
                <p className="text-center text-gray-500">
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
