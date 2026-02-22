"use client";

import { create } from "zustand";
import { VehicleWithLogs } from "@/types/database";

interface VehicleStore {
    vehicles: VehicleWithLogs[];
    selectedVehicleId: string | null;
    setVehicles: (vehicles: VehicleWithLogs[]) => void;
    setSelectedVehicleId: (id: string) => void;
    getSelectedVehicle: () => VehicleWithLogs | undefined;
}

export const useVehicleStore = create<VehicleStore>((set, get) => ({
    vehicles: [],
    selectedVehicleId: null,
    setVehicles: (vehicles) => set({ vehicles }),
    setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
    getSelectedVehicle: () => {
        const state = get();
        return state.vehicles.find((v) => v.id === state.selectedVehicleId);
    },
}));
