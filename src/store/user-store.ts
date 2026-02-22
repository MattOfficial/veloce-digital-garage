import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';

export type DistanceUnit = 'km' | 'miles';

interface UserProfile {
    displayName: string | null;
    avatarUrl: string | null;
    currency: string;
    distanceUnit: DistanceUnit;
    email: string | undefined;
}

interface UserState {
    profile: UserProfile;
    isLoading: boolean;
    fetchProfile: () => Promise<void>;
    updateProfileOptimistic: (updates: Partial<UserProfile>) => void;
    getVolumeUnit: () => string;
    getFuelEconomyUnit: () => string;
}

export const useUserStore = create<UserState>((set, get) => ({
    profile: {
        displayName: null,
        avatarUrl: null,
        currency: '₹', // Default fallback
        distanceUnit: 'km', // Default fallback
        email: undefined,
    },
    isLoading: true,

    fetchProfile: async () => {
        set({ isLoading: true });
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data } = await supabase
                .from("users")
                .select("display_name, avatar_url, currency, distance_unit")
                .eq("id", user.id)
                .single();

            set({
                profile: {
                    displayName: data?.display_name || null,
                    avatarUrl: data?.avatar_url || null,
                    currency: data?.currency || '₹',
                    distanceUnit: (data?.distance_unit as DistanceUnit) || 'km',
                    email: user.email
                },
                isLoading: false,
            });
        } else {
            set({ isLoading: false });
        }
    },

    updateProfileOptimistic: (updates) => {
        set((state) => ({
            profile: { ...state.profile, ...updates }
        }));
    },

    getVolumeUnit: () => {
        const { profile } = get();
        if (profile.distanceUnit === 'km') return 'Liters';
        // If miles, check if currency is £ to assume UK gallons, else default to US Gallons
        if (profile.currency === '£') return 'Gallons (UK)';
        return 'Gallons';
    },

    getFuelEconomyUnit: () => {
        const { profile } = get();
        if (profile.distanceUnit === 'km') return 'km/L';
        if (profile.currency === '£') return 'MPG (UK)';
        return 'MPG';
    }
}));
