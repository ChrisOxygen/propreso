"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit, FiFileText, FiUserPlus } from "react-icons/fi";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileSelector from "./profile/ProfileSelector";
import { useDashboardActions } from "@/hooks/useDashboardActions";

const DashboardHeader = () => {
  const { data: user, isLoading } = useUser();
  const { activeProfile, profiles, profilesLoading, handleSetActiveProfile } =
    useDashboardActions();

  const selectedProfileId = activeProfile?.id;

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const onEditProfilePicture = () => {
    // Implementation for editing profile picture
  };

  // Render skeleton loading state
  if (isLoading) {
    return (
      <div className="bg-white border-b w-full border-gray-200 py-4 md:py-8">
        <div className="container mx-auto w-full px-4">
          <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center gap-4 md:gap-6">
            {/* Left section skeleton */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative">
                <Skeleton className="h-16 w-16 md:h-24 md:w-24 rounded-full" />
              </div>
              <div>
                <Skeleton className="h-7 md:h-9 w-40 md:w-48 mb-2" />
                <Skeleton className="h-4 md:h-5 w-28 md:w-36" />
              </div>
            </div>

            {/* Right section skeleton */}
            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
              <div className="text-left md:text-right">
                <Skeleton className="h-6 md:h-7 w-32" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Skeleton className="h-10 w-full sm:w-40" />
                <Skeleton className="h-10 w-full sm:w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white border-b self-end border-t w-full border-gray-200 py-4 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">
            Error loading user data. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  const { fullName, image, email } = user;
  const proposalsSent = 0;

  return (
    <div className=" self-end border-b border-t w-full border-gray-200 py-5 lg:py-4">
      <div className="container mx-auto w-full px-4">
        <div className="flex flex-col lg:flex-row justify-between w-full items-center gap-4 md:gap-6">
          {/* Left section - Profile */}
          <div className="flex lg:flex-row flex-col items-center gap-4 md:gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 md:h-24 md:w-24 border-2 border-gray-200">
                <AvatarImage src={image!} alt={fullName} />
                <AvatarFallback className="text-base md:text-xl bg-black text-white">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onEditProfilePicture}
                      className="absolute bottom-0 right-0 bg-white text-black p-1.5 md:p-2 rounded-full border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <FiEdit size={14} className="md:hidden" />
                      <FiEdit size={16} className="hidden md:block" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit profile picture</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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

          {/* Right section - Stats and Actions */}
          <div className="flex flex-col items-center lg:items-end gap-3 w-full md:w-auto">
            <div className=" flex  gap-2">
              <p className=" ">proposals sent:</p>
              <p className="">
                {proposalsSent === 0 ? (
                  <span className="text-gray-400 font-semibold">None</span>
                ) : (
                  <span className="text-green-500">Proposals sent</span>
                )}
              </p>
            </div>

            <div className="flex flex-col  sm:flex-row gap-3 items-center justify-center w-full">
              <Link
                className="flex items-center justify-center gap-2 border min-w-[220px] px-4 py-2 text-black hover:bg-gray-100 rounded-lg text-sm md:text-base"
                href={`/dashboard/create-profile`}
              >
                <FiUserPlus size={16} />
                <span>Add Profile</span>
              </Link>
              <Link
                className="bg-black text-white hover:bg-gray-800 min-w-[220px] px-4 py-2 flex rounded-lg items-center justify-center gap-2 text-sm md:text-base"
                href={`/create-proposal`}
              >
                <FiFileText size={16} />
                <span>Proposal Editor</span>
              </Link>
              <ProfileSelector
                handleProfileSelect={handleSetActiveProfile}
                profiles={profiles}
                selectedProfileId={selectedProfileId}
                profilesLoading={profilesLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
