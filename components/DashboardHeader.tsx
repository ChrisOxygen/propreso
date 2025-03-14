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
      <div className="bg-white border-b w-full border-gray-200 py-8">
        <div className="container mx-auto w-full px-4">
          <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center gap-6">
            {/* Left section skeleton */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <div>
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-36" />
              </div>
            </div>

            {/* Right section skeleton */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="text-center md:text-right">
                <Skeleton className="h-7 w-32" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white border-b w-full border-gray-200 py-8">
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
    <div className="bg-white border-b w-full border-gray-200 py-8">
      <div className="container mx-auto w-full px-4">
        <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center gap-6">
          {/* Left section - Profile */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-gray-200">
                <AvatarImage src={image!} alt={fullName} />
                <AvatarFallback className="text-xl bg-black text-white">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onEditProfilePicture}
                      className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <FiEdit size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit profile picture</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-black truncate max-w-md">
                {fullName}
              </h1>
              <p className="text-gray-600 mt-1">{email}</p>
            </div>
          </div>

          {/* Right section - Stats and Actions */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="text-center md:text-right">
              <span className="text-xl font-bold text-black">
                {proposalsSent}
              </span>
              <span className="text-gray-600 text-xl"> Proposals sent</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                className="flex items-center gap-2 border px-6 py-2 text-black hover:bg-gray-100 rounded-lg"
                href={`/dashboard/create-profile`}
              >
                <FiUserPlus size={16} />
                <span>Add New Profile</span>
              </Link>
              <Link
                className="bg-black text-white hover:bg-gray-800 px-6 py-2 flex rounded-lg items-center gap-2"
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
