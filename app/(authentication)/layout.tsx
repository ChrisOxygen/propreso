import React from "react";

function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 relative">
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-12">
          <h2 className="text-white text-3xl font-bold">
            Create winning proposals in minutes with Claude AI
          </h2>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 py-12 px-8 lg:px-16 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}

export default AuthPageLayout;
