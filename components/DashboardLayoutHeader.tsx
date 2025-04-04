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
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <div className="w-full flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <Fragment key={breadcrumb.href}>
                  <BreadcrumbItem
                    className={index === 0 ? "hidden md:block" : ""}
                  >
                    {breadcrumb.isCurrentPage ? (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={breadcrumb.href}>
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator
                      className={index === 0 ? "hidden md:block" : ""}
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
