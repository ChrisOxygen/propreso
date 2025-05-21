"use client";

import { NavMain } from "@/components/sideBar/nav-main";
import { NavSecondary } from "@/components/sideBar/nav-secondary";
import { NavUser } from "@/components/sideBar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "@/constants";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useUser();

  // if (isLoading) {
  //   return <Skeleton className="w-[260px] h-screen" />;
  // }

  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-0">
            <SidebarMenuButton className="!m-0 !p-0" size="lg" asChild>
              <Link
                href="/"
                className="flex w-full items-center justify-start gap-[5px] !p-0 sm:gap-3"
              >
                <div className="relative grid size-[17px] place-items-center rounded-lg bg-[#BF4008] p-2.5 sm:size-[35px]">
                  <Image
                    src="/assets/site-icon-white.svg"
                    alt="Hero Icon"
                    width={14}
                    height={19}
                    className="absolute top-1/2 left-1/2 h-[9px] w-[7px] -translate-x-1/2 -translate-y-1/2 sm:h-[19px] sm:w-[14px]"
                  />
                </div>
                <span className="text-blackl font-['IBM_Plex_Mono'] text-xl font-semibold">
                  Propreso
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="[&>nav_.active]:bg-[#FDF9F6] [&>nav_.active]:text-[#BF4008] [&>nav_a]:font-[Lato] [&>nav_a]:text-[#404040] [&>nav_a]:transition-colors [&>nav_a]:duration-200 [&>nav_a:hover]:text-[#BF4008]">
        <NavMain items={PRIMARY_NAV_ITEMS} />
        <NavSecondary items={SECONDARY_NAV_ITEMS} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-zinc-200">
        <NavUser user={user!} />
      </SidebarFooter>
    </Sidebar>
  );
}
