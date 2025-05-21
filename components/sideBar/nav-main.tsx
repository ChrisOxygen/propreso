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
              <Link href={item.url} className="cursor-pointer">
                <SidebarMenuButton
                  className={`cursor-pointer font-[Lato] text-[#404040] transition-colors duration-200 hover:text-[#BF4008] ${
                    isActivePath ? "!bg-[#FDF9F6] !text-[#BF4008]" : ""
                  }`}
                  isActive={isActivePath}
                  tooltip={item.title}
                >
                  {item.icon && (
                    <item.icon
                      className={
                        isActivePath ? "text-[#BF4008]" : "text-[#404040]"
                      }
                    />
                  )}
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
