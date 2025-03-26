import DashboardProfileSection from "@/components/dashboard/DashboardProfileSection";
import DashboardHeader from "@/components/DashboardHeader";
import React from "react";

function ProfilePage() {
  return (
    <main className="lg:grid grid-rows-[140px_1fr] h-full items-center flex flex-col">
      <DashboardHeader />
      <DashboardProfileSection />
    </main>
  );
}

export default ProfilePage;
