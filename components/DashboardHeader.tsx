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

const DashboardHeader = () => {
  const { data: user, isLoading } = useUser();

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
      <div className="bg-white border-b w-full border-gray-200 py-4 md:py-8">
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
    <div className="bg-white border-b w-full border-gray-200 py-4 md:py-8">
      <div className="container mx-auto w-full px-4">
        <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center gap-4 md:gap-6">
          {/* Left section - Profile */}
          <div className="flex items-center gap-4 md:gap-6">
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

            <div>
              <h1 className="text-xl md:text-3xl font-bold text-black truncate max-w-[200px] md:max-w-md">
                {fullName}
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-0.5 md:mt-1 truncate max-w-[200px] md:max-w-md">
                {email}
              </p>
            </div>
          </div>

          {/* Right section - Stats and Actions */}
          <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
            <div className="text-left md:text-right">
              <span className="text-lg md:text-xl font-bold text-black">
                {proposalsSent}
              </span>
              <span className="text-base md:text-xl text-gray-600">
                {" "}
                Proposals sent
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                className="flex items-center justify-center gap-2 border px-4 py-2 text-black hover:bg-gray-100 rounded-lg text-sm md:text-base"
                href={`/dashboard/create-profile`}
              >
                <FiUserPlus size={16} />
                <span>Add Profile</span>
              </Link>
              <Link
                className="bg-black text-white hover:bg-gray-800 px-4 py-2 flex rounded-lg items-center justify-center gap-2 text-sm md:text-base"
                href={`/create-proposal`}
              >
                <FiFileText size={16} />
                <span>Proposal Editor</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
