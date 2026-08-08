"use client";

import { useVehicleStore } from "@/store/vehicle-store";
import {
  BarChart2,
  BatteryCharging,
  Car,
  Fuel,
  LayoutDashboard,
  LogOut,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
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

/**
 * `/dashboard/fuel` renders an entirely different page for a pure EV — energy,
 * battery health and charge sessions, with no fuel anywhere on it — so the nav
 * entry has to follow the vehicle rather than the route. A plug-in hybrid keeps
 * the fuel wording because it keeps the fuel page.
 */
function buildNavigation(isEv: boolean) {
  return [
    {
      name: ui.sidebar.items.dashboard,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    isEv
      ? {
          name: ui.sidebar.items.energyBattery,
          href: "/dashboard/fuel",
          icon: BatteryCharging,
        }
      : {
          name: ui.sidebar.items.fuelHistory,
          href: "/dashboard/fuel",
          icon: Fuel,
        },
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
}

export function AppSidebar() {
  const pathname = usePathname();
  const { profile, fetchProfile } = useUserStore();
  const { fetchVehicles } = useVehicleStore();
  const selectedVehicle = useVehicleStore((state) => state.getSelectedVehicle());
  const navigation = useMemo(
    () => buildNavigation(selectedVehicle?.powertrain === "ev"),
    [selectedVehicle?.powertrain],
  );

  useEffect(() => {
    fetchProfile();
    fetchVehicles();
  }, [fetchProfile, fetchVehicles]);

  const isNavigationItemActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        pathname === href || pathname.startsWith("/dashboard/vehicles/")
      );
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const displayName =
    profile.displayName || profile.email?.split("@")[0] || brand.app.shortName;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex w-full items-center justify-center overflow-hidden border-b border-border/60 p-4 transition-all group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:py-4">
          <div className="flex items-center gap-2 overflow-hidden w-full group-data-[collapsible=icon]:justify-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Car className="h-4.5 w-4.5" />
            </div>
            <h1 className="truncate text-base font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
              {brand.app.compactName}
            </h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground group-data-[collapsible=icon]:hidden">
            {ui.sidebar.sectionTitle}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavigationItemActive(item.href)}
                    tooltip={item.name}
                    className="mx-auto rounded-xl transition-colors duration-150 hover:bg-muted/70 data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl"
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
            className="mb-2 flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors duration-150 hover:bg-secondary/50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
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
              className="mx-auto w-full justify-start rounded-xl text-muted-foreground transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center"
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
