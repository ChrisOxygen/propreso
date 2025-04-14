"use client";

import { WandSparkles } from "lucide-react";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useUser();

  // if (isLoading) {
  //   return <Skeleton className="w-[260px] h-screen" />;
  // }

  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/proposals">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <WandSparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Propreso Ai</span>
                  <span className="truncate text-xs">Proposal generator</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={PRIMARY_NAV_ITEMS} />
        <NavSecondary items={SECONDARY_NAV_ITEMS} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
    </Sidebar>
  );
}
