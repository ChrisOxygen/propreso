"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useUser } from "@/hooks/useUser";

import ProfileSelectorUI from "./ProfileSelectorUI";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSetDefaultProfile } from "../hooks/user-profile-hooks/useSetDefaultProfile";
import { ProfileWithProjects } from "@/app/(main)/profile/page";

type ProfilePageHeaderProps = {
  handleProfileChange: (profileId: string) => void;
  visibleProfile: ProfileWithProjects | null;
  userProfiles: ProfileWithProjects[];
};

function ProfilePageHeader({
  handleProfileChange,
  visibleProfile,
  userProfiles,
}: ProfilePageHeaderProps) {
  const { data: user, isPending } = useUser();
  const { setAsDefault, isSettingDefault } = useSetDefaultProfile();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  if (isPending) {
    return (
      <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  if (!user) {
    return null;
  }

  const { fullName, image, email } = user;

  const profileSelectOptions =
    userProfiles?.map((profile) => ({
      value: profile.id,
      label: profile.jobTitle,
    })) || [];

  const defaltId =
    userProfiles?.find((profile) => profile.isDefault)?.id || null;

  const handleMarkAsDefault = () => {
    if (!visibleProfile) return;
    setAsDefault(visibleProfile.id);
  };

  return (
    <div className=" flex lg:flex-row flex-col lg:gap-6 items-center justify-between w-full px-4">
      <div className="flex lg:flex-row flex-col lg:mb-0 mb-5 items-center gap-4 md:gap-4">
        <div className="relative">
          <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-gray-200">
            <AvatarImage src={image!} alt={fullName} />
            <AvatarFallback className="text-base md:text-xl bg-black text-white">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex lg:items-start items-center flex-col">
          <h1 className="hidden sm:block text-xl md:text-2xl font-bold text-black truncate max-w-[400px] md:max-w-md">
            {fullName}
          </h1>
          <h1 className="sm:hidden text-xl md:text-2xl font-bold text-black truncate max-w-[200px] md:max-w-md">
            {fullName.split(" ")[0]}
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-0.5 md:mt-1 truncate max-w-[200px] md:max-w-md">
            {email}
          </p>
        </div>
      </div>
      <div className="  flex @[1170px]:flex-row flex-col items-center lg:items-end w-full justify-end @container gap-3 @[1170px]:gap-8 ">
        <ProfileSelectorUI
          label="Switch Profile"
          placeholder="Select a profile"
          options={profileSelectOptions}
          value={visibleProfile!.id}
          defaltId={defaltId}
          onChange={(value) => handleProfileChange(value)}
        />
        <div className="flex items-center h-full gap-4 lg:mt-0 mt-5 w-full max-w-[400px]">
          <Button
            onClick={handleMarkAsDefault}
            disabled={isSettingDefault || visibleProfile!.isDefault}
            className=" grow"
          >
            {isSettingDefault ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : visibleProfile!.isDefault ? (
              "Default Profile"
            ) : (
              "Mark as default"
            )}
          </Button>

          <Button variant="outline" asChild className=" grow">
            <Link href="/profile/create">Create new Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageHeader;
