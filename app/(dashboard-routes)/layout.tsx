"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  FiHome,
  FiFileText,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import InBoxLoader from "@/components/InBoxLoader";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ href, icon, label, isActive, onClick }: NavItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 p-3 rounded-lg transition-colors",
      isActive
        ? "bg-gray-800 text-white"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    )}
    onClick={onClick}
  >
    <div className="text-xl">{icon}</div>
    <span>{label}</span>
  </Link>
);

function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check authentication status and redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("User is not authenticated, redirecting to login page");
      router.push("/login");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return <InBoxLoader />;
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    return null; // Will redirect in the useEffect
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const navItems = [
    { href: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    { href: "/create-proposal", icon: <FiFileText />, label: "Proposals" },
    { href: "/create-profile", icon: <FiUser />, label: "My Profile" },
  ];

  return (
    <main className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="block md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="bg-black text-white border-none"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </Button>
      </div>

      {/* Sidebar - hidden on mobile unless toggled */}
      <div
        className={cn(
          "bg-black text-white w-full md:w-64 flex-shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out h-screen",
          "fixed md:static inset-y-0 left-0 z-40",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo & nav links */}
        <div className="p-4 overflow-y-auto">
          <div className="px-4 py-6">
            <h1 className="text-xl font-bold mb-6">Proposal AI</h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
                onClick={closeSidebar}
              />
            ))}
          </nav>
        </div>

        {/* User info */}
        {session?.user && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                {session.user.name?.charAt(0) ||
                  session.user.email?.charAt(0) ||
                  "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  {session.user.name || session.user.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start gap-3 text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleLogout}
            >
              <FiLogOut />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>

      {/* Sidebar backdrop on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-0 p-0 overflow-y-auto">
        <div className="min-h-full bg-white">{children}</div>
      </div>
    </main>
  );
}

export default DashboardLayout;
