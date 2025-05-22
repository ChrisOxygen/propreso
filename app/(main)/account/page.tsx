"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";
import { useUserProfiles } from "@/features/profiles/hooks/user-profile-hooks/useUserProfiles";
import { useState } from "react";
import Link from "next/link";
import { User, Pencil, Check } from "lucide-react";
import InBoxLoader from "@/components/InBoxLoader";
import useUpdateAccount from "@/hooks/useUpdateAccount";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

function AccountPage() {
  const { data: user, isPending } = useUser();
  const { data: userProfiles, isPending: profilesLoading } = useUserProfiles();
  const { mutate, isPending: isUpdating } = useUpdateAccount();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");

  // Handle starting to edit the name
  const handleEdit = () => {
    setFullName(user?.fullName || "");
    setEditing(true);
  };

  // Save updated user info
  const handleSave = async () => {
    mutate({ fullName });
  };
  // Add this function to your component before the return statement
  const handleImageUpload = async (file: File) => {
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("file", file);

      // Upload to your backend or image hosting service
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      // Update the user account with the new image URL
      mutate({ imageUrl: data.url });
    } catch (error) {
      console.error("Error uploading image:", error);
      // You could add a toast notification here for better user feedback
    }
  };

  if (isPending) {
    return <InBoxLoader />;
  }

  if (!user) {
    return (
      <div className="grid h-[50vh] place-items-center">
        <p className="font-[Lato] text-lg tracking-[0.08px] text-[#404040]">
          User not found
        </p>
      </div>
    );
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-center font-[Poppins] text-3xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
        Account Settings
      </h1>

      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        {/* Profile Section - Centered Vertically */}
        <div className="p-6">
          <h2 className="mb-4 text-center font-[Poppins] text-xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
            Your Profile
          </h2>

          <div className="flex flex-col items-center gap-6">
            {/* Avatar at the top */}
            <div className="flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="group relative cursor-pointer"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                    >
                      <Avatar className="h-40 w-40 transition-all duration-200">
                        <AvatarImage
                          src={user.image || ""}
                          alt={user.fullName || ""}
                        />
                        <AvatarFallback className="bg-[#FDF9F6] text-2xl text-[#BF4008]">
                          {getInitials(user.fullName || "User")}
                        </AvatarFallback>

                        {/* Hover overlay with plus icon */}
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <Plus className="h-8 w-8 text-white" />
                        </div>
                      </Avatar>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="font-[Lato]">
                    Upload picture
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Hidden file input for image upload */}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* Full Name - Larger and centered */}
            <div className="max-w-md text-center">
              <p className="font-[Lato] text-sm text-[#404040]">Full Name</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-zinc-200 text-center font-[Lato] text-lg focus:border-[#BF4008] focus:ring-[#BF4008]"
                  />
                  <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="bg-[#BF4008] font-[Lato] text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
                  >
                    {isUpdating ? (
                      <InBoxLoader />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <h3 className="font-[Poppins] text-2xl font-medium text-[#2C2C2C]">
                    {user.fullName || "Add your name"}
                  </h3>
                  <Button
                    variant="link"
                    onClick={handleEdit}
                    className="mt-1 h-auto p-0 font-[Lato] text-sm text-[#BF4008] hover:text-[#BF4008]/80"
                  >
                    Change account name
                  </Button>
                </div>
              )}
            </div>

            {/* Email Address - at the bottom */}
            <div className="text-center">
              <p className="font-[Lato] text-sm text-[#404040]">
                Email Address
              </p>
              <p className="font-[Lato] text-[#2C2C2C]">{user.email}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-200" />

        {/* Freelance Profiles Section */}
        <div className="p-6">
          <h2 className="mb-4 text-center font-[Poppins] text-xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
            Your Freelance Profiles
          </h2>

          {profilesLoading ? (
            <Skeleton className="h-[230px] w-full rounded-md" />
          ) : userProfiles && userProfiles.length > 0 ? (
            <ScrollArea className="h-full max-h-[400px]">
              <div className="space-y-4">
                {userProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="rounded-md border border-zinc-200 p-4 transition-colors duration-200 hover:border-[#BF4008]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-[Poppins] text-lg font-medium text-[#2C2C2C]">
                          {profile.jobTitle}
                          {profile.isDefault && (
                            <span className="ml-2 rounded-full bg-[#FDF9F6] px-2 py-1 text-xs text-[#BF4008]">
                              Default
                            </span>
                          )}
                        </h3>
                        <p className="line-clamp-2 font-[Lato] text-sm text-[#404040]">
                          {profile.bio
                            ? profile.bio.substring(0, 100) + "..."
                            : "No bio provided"}
                        </p>
                      </div>
                      <Link href={`/profile?profileId=${profile.id}`}>
                        <Button
                          variant="outline"
                          className="border-zinc-200 font-[Lato] text-[#404040] hover:bg-[#FDF9F6] hover:text-[#BF4008]"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="rounded-md bg-[#FDF9F6] p-6 text-center">
              <User className="mx-auto h-12 w-12 text-[#BF4008] opacity-80" />
              <h3 className="mt-4 font-[Poppins] text-lg font-medium text-[#2C2C2C]">
                No Profiles Yet
              </h3>
              <p className="mt-2 font-[Lato] text-[#404040]">
                Create a freelance profile to start generating proposals
              </p>
              <Button
                asChild
                className="mt-4 bg-[#BF4008] font-[Lato] text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
              >
                <Link href="/profile/create">Create Profile</Link>
              </Button>
            </div>
          )}

          {userProfiles && userProfiles.length > 0 && (
            <div className="mt-4 text-center">
              <Button
                asChild
                variant="outline"
                className="border-zinc-200 font-[Lato] text-[#404040] hover:border-[#BF4008] hover:bg-[#FDF9F6] hover:text-[#BF4008]"
              >
                <Link href="/profile/create">Create Another Profile</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
