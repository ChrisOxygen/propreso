"use client";

import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";
import InBoxLoader from "@/components/InBoxLoader";
import NoProfile from "./NoProfile";

function MainLayoutContainer({ children }: { children: React.ReactNode }) {
  const { data: user, isPending } = useUser();
  const pathname = usePathname();

  // Pages that should be accessible without a profile
  const exemptPages = [
    "/profile/create",
    "/account",
    "/support",
    "/feedback",
    "/terms",
    "/privacy",
  ];

  // Check if current page is exempt from profile requirement
  const isExemptPage = exemptPages.some((page) => pathname.startsWith(page));

  if (isPending) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex h-[60vh] items-center justify-center">
          <InBoxLoader />
        </div>
      </div>
    );
  }

  // If page is exempt, or user has a profile, render children
  if (isExemptPage || user?.hasCreatedProfile) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    );
  }

  // Otherwise show the NoProfile component
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <NoProfile />
    </div>
  );
}

export default MainLayoutContainer;
