import { AppSidebar } from "@/components/sideBar/app-sidebar";
import DashboardLayoutHeader from "@/components/DashboardLayoutHeader";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
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
