import * as React from "react";
import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActivePath = pathname === item.url;
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
