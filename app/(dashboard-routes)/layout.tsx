import { ReactNode } from "react";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid grid-cols-[90px_1fr] min-h-screen  w-full">
      <div className=" bg-black"></div>
      <div className=" ">{children}</div>
    </main>
  );
}

export default DashboardLayout;
