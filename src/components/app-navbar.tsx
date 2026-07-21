"use client";

import { useSyncExternalStore } from "react";
import { useVehicleStore } from "@/store/vehicle-store";
import { ui } from "@/content/en/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SidebarTrigger,
} from "@mattofficial/veloce-ui";

export function AppNavbar() {
  const { vehicles, selectedVehicleId, setSelectedVehicleId } =
    useVehicleStore();
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/70 bg-background/90 px-3 backdrop-blur-xl md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>

      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        <label className="text-sm font-medium hidden md:block text-muted-foreground">
          {ui.common.navigation.currentVehicle}
        </label>
        {isMounted ? (
          <Select
            value={selectedVehicleId || ""}
            onValueChange={setSelectedVehicleId}
            disabled={vehicles.length === 0}
          >
            <SelectTrigger className="w-[min(11rem,58vw)] rounded-full md:w-48">
              <SelectValue placeholder={ui.common.navigation.selectVehicle} />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.make} {v.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex h-9 w-[min(11rem,58vw)] items-center rounded-full border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground md:w-48">
            {ui.common.navigation.selectVehicle}
          </div>
        )}
        <ThemeToggle variant="compact" />
      </div>
    </header>
  );
}
