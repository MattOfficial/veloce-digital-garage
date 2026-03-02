import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppNavbar } from "@/components/app-navbar";
import { VeloceCopilot } from "@/components/veloce-copilot";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col flex-1 h-screen w-full">
                <AppNavbar />
                <main className="flex-1 overflow-auto bg-muted/40 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
                <VeloceCopilot />
            </div>
        </SidebarProvider>
    );
}
