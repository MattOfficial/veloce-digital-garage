"use client";

import { useVehicleStore } from "@/store/vehicle-store";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Car, Fuel, Wrench, BarChart2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";
import { SidebarFooter } from "@/components/ui/sidebar";

const navigation = [
    { name: "Dashboard", href: "/", icon: Car },
    { name: "Fill Up", href: "/fuel", icon: Fuel },
    { name: "Maintenance", href: "/maintenance", icon: Wrench },
    { name: "Insights", href: "/insights", icon: BarChart2 },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <div className="flex items-center justify-center p-4 py-8">
                        <h1 className="text-xl font-bold italic text-primary">
                            Digital Garage
                        </h1>
                    </div>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                                        <Link href={item.href}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <form action={logout}>
                    <SidebarMenuButton type="submit" className="w-full justify-start text-muted-foreground hover:text-foreground">
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Log Out</span>
                    </SidebarMenuButton>
                </form>
            </SidebarFooter>
        </Sidebar>
    );
}
