"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { generateBreadcrumbs } from "@/lib/services";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import TimeBasedGreeting from "./TimeBasedGreeting";
import NotificationIcon from "./NotificationIcon";

function DashboardLayoutHeader() {
  const pathname = usePathname();

  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 text-[#404040] transition-colors duration-200 hover:bg-[#FDF9F6] hover:text-[#BF4008]" />
        <Separator
          orientation="vertical"
          className="mr-2 bg-zinc-200 data-[orientation=vertical]:h-4"
        />
        <div className="flex w-full items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <Fragment key={breadcrumb.href}>
                  <BreadcrumbItem
                    className={index === 0 ? "hidden md:block" : ""}
                  >
                    {breadcrumb.isCurrentPage ? (
                      <BreadcrumbPage className="font-[Lato] text-[#2C2C2C]">
                        {breadcrumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={breadcrumb.href}
                        className="font-[Lato] text-[#404040] transition-colors duration-200 hover:text-[#BF4008]"
                      >
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator
                      className={`text-[#404040] ${index === 0 ? "hidden md:block" : ""}`}
                    />
                  )}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-3">
            <NotificationIcon />
            <TimeBasedGreeting />
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardLayoutHeader;
