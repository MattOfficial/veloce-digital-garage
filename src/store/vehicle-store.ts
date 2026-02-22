"use client";

import { create } from "zustand";
import { VehicleWithLogs } from "@/types/database";
import { createClient } from "@/utils/supabase/client";

interface VehicleStore {
    vehicles: VehicleWithLogs[];
    selectedVehicleId: string | null;
    isLoading: boolean;
    setVehicles: (vehicles: VehicleWithLogs[]) => void;
    setSelectedVehicleId: (id: string) => void;
    getSelectedVehicle: () => VehicleWithLogs | undefined;
    fetchVehicles: () => Promise<void>;
}

export const useVehicleStore = create<VehicleStore>((set, get) => ({
    vehicles: [],
    selectedVehicleId: null,
    isLoading: true,
    setVehicles: (vehicles) => set({ vehicles }),
    setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
    getSelectedVehicle: () => {
        const state = get();
        return state.vehicles.find((v) => v.id === state.selectedVehicleId);
    },
    fetchVehicles: async () => {
        set({ isLoading: true });
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data } = await supabase
                .from("vehicles")
                .select(`
                    *,
                    fuel_logs (*),
                    maintenance_logs (*)
                `)
                .eq("user_id", user.id)
                .order('created_at', { ascending: false });

            const fetchedVehicles = (data as unknown as VehicleWithLogs[]) || [];

            set((state) => ({
                vehicles: fetchedVehicles,
                // Default to the first vehicle if none selected yet
                selectedVehicleId: state.selectedVehicleId || (fetchedVehicles.length > 0 ? fetchedVehicles[0].id : null),
                isLoading: false
            }));
        } else {
            set({ vehicles: [], selectedVehicleId: null, isLoading: false });
        }
    }
}));
