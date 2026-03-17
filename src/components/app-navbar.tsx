"use client";

import { useSyncExternalStore } from "react";
import { useVehicleStore } from "@/store/vehicle-store";
import { ui } from "@/content/en/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SidebarTrigger,
} from "@veloce/ui";

export function AppNavbar() {
  const { vehicles, selectedVehicleId, setSelectedVehicleId } =
    useVehicleStore();
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/60 backdrop-blur-md px-4 md:px-6 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="text-sm font-medium tracking-tight h-4 bg-muted animate-pulse w-32 rounded md:hidden" />
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium hidden md:block text-muted-foreground">
          {ui.common.navigation.currentVehicle}
        </label>
        {isMounted ? (
          <Select
            value={selectedVehicleId || ""}
            onValueChange={setSelectedVehicleId}
            disabled={vehicles.length === 0}
          >
            <SelectTrigger className="w-45">
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
          <div className="flex h-9 w-45 items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground shadow-xs">
            {ui.common.navigation.selectVehicle}
          </div>
        )}
      </div>
    </header>
  );
}
