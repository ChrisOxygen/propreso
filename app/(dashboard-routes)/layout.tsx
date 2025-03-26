import { AppSidebar } from "@/components/sideBar/app-sidebar";
import DashboardLayoutHeader from "@/components/DashboardLayoutHeader";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardLayoutHeader />
        <div className="flex flex-1 flex-col gap-4   p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
