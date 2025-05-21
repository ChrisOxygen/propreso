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
      <div className="h-10 w-10 animate-pulse rounded-full bg-[#F8E5DB]"></div>
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
    <div className="flex w-full flex-col items-center justify-between px-4 lg:flex-row lg:gap-6">
      <div className="mb-5 flex flex-col items-center gap-4 md:gap-4 lg:mb-0 lg:flex-row">
        <div className="relative">
          <Avatar className="h-16 w-16 border-2 border-[#F8E5DB] md:h-20 md:w-20">
            <AvatarImage src={image!} alt={fullName} />
            <AvatarFallback className="bg-[#BF4008] font-[Poppins] text-base text-white md:text-xl">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <h1 className="hidden max-w-[400px] truncate font-[Poppins] text-xl font-bold tracking-[-0.4px] text-[#2C2C2C] sm:block md:max-w-md md:text-2xl">
            {fullName}
          </h1>
          <h1 className="max-w-[200px] truncate font-[Poppins] text-xl font-bold tracking-[-0.4px] text-[#2C2C2C] sm:hidden md:max-w-md md:text-2xl">
            {fullName.split(" ")[0]}
          </h1>
          <p className="mt-0.5 max-w-[200px] truncate font-[Lato] text-sm tracking-[0.08px] text-[#404040] md:mt-1 md:max-w-md md:text-base">
            {email}
          </p>
        </div>
      </div>
      <div className="@container flex w-full flex-col items-center justify-end gap-3 lg:items-end @[1170px]:flex-row @[1170px]:gap-8">
        <ProfileSelectorUI
          label="Switch Profile"
          placeholder="Select a profile"
          options={profileSelectOptions}
          value={visibleProfile!.id}
          defaltId={defaltId}
          onChange={(value) => handleProfileChange(value)}
        />
        <div className="mt-5 flex h-full w-full max-w-[400px] items-center gap-4 lg:mt-0">
          <Button
            onClick={handleMarkAsDefault}
            disabled={isSettingDefault || visibleProfile!.isDefault}
            className="grow bg-[#BF4008] font-[Lato] font-medium text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
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

          <Button
            variant="outline"
            asChild
            className="grow border-zinc-200 bg-white font-[Lato] text-[#2C2C2C] transition-colors duration-200 hover:bg-zinc-50"
          >
            <Link href="/profile/create">Create new Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageHeader;
