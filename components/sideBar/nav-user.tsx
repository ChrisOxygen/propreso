"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import { User } from "@prisma/client";
import Link from "next/link";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();

  if (!user) return <Skeleton className="h-[50px] w-full" />;

  const { fullName, email, image } = user;

  const firstName = fullName.split(" ")[0];

  const avatarFallback = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-[#FDF9F6] data-[state=open]:text-[#BF4008]"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={image as string} alt={firstName} />
                <AvatarFallback className="rounded-lg bg-[#F8E5DB] text-[#BF4008]">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-[Poppins] font-medium tracking-[-0.4px] text-[#2C2C2C]">
                  {firstName}
                </span>
                <span className="truncate font-[Lato] text-xs tracking-[0.08px] text-[#404040]">
                  {email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-[#404040]" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-zinc-200"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={image as string} alt={firstName} />
                  <AvatarFallback className="rounded-lg bg-[#F8E5DB] text-[#BF4008]">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-[Poppins] font-medium tracking-[-0.4px] text-[#2C2C2C]">
                    {firstName}
                  </span>
                  <span className="truncate font-[Lato] text-xs tracking-[0.08px] text-[#404040]">
                    {email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-200" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="font-[Lato] text-[#404040] transition-colors duration-200 hover:bg-[#FDF9F6] hover:text-[#BF4008]">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-zinc-200" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                asChild
                className="font-[Lato] text-[#404040] transition-colors duration-200 hover:bg-[#FDF9F6] hover:text-[#BF4008]"
              >
                <Link href="/account" className="flex items-center gap-2">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="font-[Lato] text-[#404040] transition-colors duration-200 hover:bg-[#FDF9F6] hover:text-[#BF4008]">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="font-[Lato] text-[#404040] transition-colors duration-200 hover:bg-[#FDF9F6] hover:text-[#BF4008]">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-zinc-200" />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="font-[Lato] text-[#404040] transition-colors duration-200 hover:bg-[#FDF9F6] hover:text-[#BF4008]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
