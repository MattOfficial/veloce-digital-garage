"use client";

import { useVehicleStore } from "@/store/vehicle-store";
import { Car, Fuel, Wrench, BarChart2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/app/login/actions";

import { useUserStore } from "@/store/user-store";
import { brand } from "@/content/en/brand";
import { ui } from "@/content/en/ui";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@mattofficial/veloce-ui";

const navigation = [
  { name: ui.sidebar.items.dashboard, href: "/dashboard", icon: Car },
  { name: ui.sidebar.items.fuelHistory, href: "/dashboard/fuel", icon: Fuel },
  {
    name: ui.sidebar.items.maintenance,
    href: "/dashboard/maintenance",
    icon: Wrench,
  },
  {
    name: ui.sidebar.items.insights,
    href: "/dashboard/insights",
    icon: BarChart2,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { profile, fetchProfile } = useUserStore();
  const { fetchVehicles } = useVehicleStore();

  useEffect(() => {
    fetchProfile();
    fetchVehicles();
  }, [pathname, fetchProfile, fetchVehicles]); // Re-fetch slightly on path change (e.g. returning from profile edit)

  const displayName =
    profile.displayName || profile.email?.split("@")[0] || brand.app.shortName;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="relative flex items-center justify-center p-4 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:py-4 transition-all overflow-hidden w-full">
          {/* Poppy gradient accent strip */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-t-lg" />
          <div className="flex items-center gap-2 overflow-hidden w-full group-data-[collapsible=icon]:justify-center">
            <Car className="h-7 w-7 text-primary shrink-0" />
            <h1 className="text-xl font-bold italic text-primary truncate group-data-[collapsible=icon]:hidden">
              {brand.app.compactName}
            </h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-xs font-bold uppercase tracking-wider text-primary/70">
            {ui.sidebar.sectionTitle}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                    className="rounded-xl transition-all duration-300 active:scale-95 hover:scale-[1.02] data-[active=true]:bg-gradient-to-r data-[active=true]:from-pink-400/20 data-[active=true]:to-purple-400/20 data-[active=true]:text-primary data-[active=true]:font-bold group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:rounded-xl mx-auto"
                  >
                    <Link href={item.href} className="w-full flex items-center">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-4 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:py-4 border-t border-border/50">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 w-full hover:bg-secondary/50 p-2 rounded-full transition-all duration-300 active:scale-95 hover:scale-[1.02] cursor-pointer mb-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
          >
            <Avatar className="h-10 w-10 border border-border/50 shrink-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
              <AvatarImage
                src={profile.avatarUrl || undefined}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden text-left group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold truncate leading-tight">
                {displayName}
              </span>
              <span className="text-xs text-muted-foreground truncate leading-tight">
                {ui.common.profile.viewProfile}
              </span>
            </div>
          </Link>
          <form action={logout} className="w-full flex justify-center">
            <SidebarMenuButton
              type="submit"
              tooltip={ui.common.profile.logOut}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-300 active:scale-95 hover:scale-[1.02] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 mx-auto"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                {ui.common.profile.logOut}
              </span>
            </SidebarMenuButton>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
