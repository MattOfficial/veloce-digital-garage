"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppNavbar } from "@/components/app-navbar";
import { AppFooter } from "@/components/app-footer";
import { VeloceCopilot } from "@/components/veloce-copilot";
import { SidebarProvider } from "@mattofficial/veloce-ui";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-full min-w-0 flex-1 flex-col">
        <AppNavbar />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_top_right,var(--color-veloce-glow),transparent_32rem)] p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <AppFooter />
        <VeloceCopilot />
      </div>
    </SidebarProvider>
  );
}
