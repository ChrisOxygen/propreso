import SiteLogo from "@/components/SiteLogo";

import React from "react";

function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Image */}
      <div className="relative hidden bg-gray-100 lg:flex lg:w-1/2">
        <div className="bg-opacity-40 absolute inset-0 flex items-end bg-[url('/assets/laptop-lady.jpg')] bg-cover bg-center p-12">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#BF4008]/90"></div>
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="self-start"></div>
            <h2 className="text-3xl font-bold text-white">
              Create winning proposals in minutes with Claude AI
            </h2>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="relative flex w-full flex-col justify-center bg-[url('/assets/hero-bg-desktop.jpg')] px-8 py-12 lg:w-1/2 lg:px-16">
        <div className="mb-10">
          <SiteLogo />
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthPageLayout;
