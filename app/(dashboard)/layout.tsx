"use client";

import { Menu } from "@/components/brand/dashboard/Menu";
import { SidebarMobile } from "@/components/brand/dashboard/MobileSidebar";
import { UserNav } from "@/components/brand/dashboard/UserNav";
import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProtectedRoute from "@/provider/protectedProvider";
import RoleCheckProvider from "@/provider/roleCheckProvider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <ProtectedRoute>
      <RoleCheckProvider>
        <section className="w-full h-screen flex flex-col">
          <div className="flex flex-1 overflow-hidden">
            <div className={`hidden lg:flex flex-col border-r bg-muted/40 transition-all duration-300 ${
              isSidebarCollapsed ? 'w-[80px]' : 'w-[220px] lg:w-[280px]'
            }`}>
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
                <Link
                  href="/"
                  className={`flex items-center gap-2 font-semibold transition-all duration-300 ${
                    isSidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                  }`}
                >
                  <img
                    src="/assets/logo_final.png"
                    className="w-10 duration-500 cursor-pointer"
                    alt="Logo"
                  />
                  <span>DiagnoTech-Ai</span>
                </Link>
                
                {/* Show only logo when collapsed */}
                {isSidebarCollapsed && (
                  <div className="flex items-center justify-center w-full">
                    <img
                      src="/assets/logo_final.png"
                      className="w-8 h-8 cursor-pointer"
                      alt="Logo"
                    />
                  </div>
                )}
                
                {/* Toggle Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className={`h-8 w-8 hover:bg-muted ${isSidebarCollapsed ? 'ml-0' : 'ml-2'}`}
                >
                  {isSidebarCollapsed ? (
                    <ChevronRight size={16} />
                  ) : (
                    <ChevronLeft size={16} />
                  )}
                </Button>
              </div>

              <Menu isCollapsed={isSidebarCollapsed} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="border-b flex gap-4 h-14 items-center justify-end lg:h-[60px] px-4 lg:px-6">
                <SidebarMobile />
                <ModeToggle />
                <UserNav />
              </header>
              <main className="flex-1 overflow-auto">
                <ScrollArea className="h-full">{children}</ScrollArea>
              </main>
            </div>
          </div>
        </section>
      </RoleCheckProvider>
    </ProtectedRoute>
  );
}
