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
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { logout } from "@/app/login/actions";
import { SidebarFooter } from "@/components/ui/sidebar";

import { useUserStore } from "@/store/user-store";

const navigation = [
    { name: "Dashboard", href: "/", icon: Car },
    { name: "Fill Up", href: "/fuel", icon: Fuel },
    { name: "Maintenance", href: "/maintenance", icon: Wrench },
    { name: "Insights", href: "/insights", icon: BarChart2 },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { profile, fetchProfile } = useUserStore();
    const { fetchVehicles } = useVehicleStore();

    useEffect(() => {
        fetchProfile();
        fetchVehicles();
    }, [pathname, fetchProfile, fetchVehicles]); // Re-fetch slightly on path change (e.g. returning from profile edit)

    const displayName = profile.displayName || profile.email?.split('@')[0] || "Driver";
    const initial = displayName.charAt(0).toUpperCase();

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
                <div className="flex flex-col gap-2 p-4 border-t border-border/50">
                    <Link href="/profile" className="flex items-center gap-3 w-full hover:bg-secondary/50 p-2 rounded-xl transition-colors cursor-pointer mb-2">
                        <Avatar className="h-10 w-10 border border-border/50">
                            <AvatarImage src={profile.avatarUrl || undefined} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initial}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden text-left">
                            <span className="text-sm font-semibold truncate leading-tight">{displayName}</span>
                            <span className="text-xs text-muted-foreground truncate leading-tight">View Profile</span>
                        </div>
                    </Link>
                    <form action={logout}>
                        <SidebarMenuButton type="submit" className="w-full justify-start text-muted-foreground hover:text-foreground">
                            <LogOut className="h-4 w-4 mr-2" />
                            <span>Log Out</span>
                        </SidebarMenuButton>
                    </form>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
