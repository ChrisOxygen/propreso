"use client";

import { type LucideIcon } from "lucide-react";

import {} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const homePathActive =
            item.url === "/proposals" && pathname === "/proposals";
          const otherPathActive =
            item.url !== "/proposals" && pathname?.includes(item.url);
          const isActivePath = homePathActive || otherPathActive;
          return (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url} className=" cursor-pointer">
                <SidebarMenuButton
                  className={`cursor-pointer ${
                    isActivePath ? "!bg-gray-200 " : ""
                  }`}
                  isActive={isActivePath}
                  tooltip={item.title}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
