import { AppSidebar } from "@/components/sideBar/app-sidebar";
import DashboardLayoutHeader from "@/components/DashboardLayoutHeader";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import MainLayoutContainer from "@/components/MainLayoutContainer";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardLayoutHeader />
        <MainLayoutContainer>{children}</MainLayoutContainer>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
