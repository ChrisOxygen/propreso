import Footer from "@/features/Home/components/Footer";
import NavBar from "@/features/Home/components/NavBar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full overflow-x-hidden">
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}

export default layout;
