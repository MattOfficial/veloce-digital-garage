import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import type { ProviderPreference } from '@/types/ai';
import {
    getDefaultEvEfficiencyUnit,
    isEvEfficiencyUnit,
    type EvEfficiencyUnit,
    type FuelEfficiencyUnit,
    type FuelVolumeUnit,
} from '@/utils/efficiency-units';

export type DistanceUnit = 'km' | 'miles';
type UserProfile = {
    displayName: string | null;
    avatarUrl: string | null;
    currency: string;
    distanceUnit: DistanceUnit;
    email: string | undefined;
    hasLlmKey: boolean;
    hasOpenAiKey: boolean;
    hasDeepseekKey: boolean;
    preferredProvider: ProviderPreference;
    /** Cost of a unit of home electricity; drives inferred home charging cost. */
    electricityTariffPerKwh: number | null;
    /** Reference petrol price and economy, used for the savings-vs-ICE comparison. */
    petrolPriceReference: number | null;
    iceReferenceEfficiency: number | null;
    evEfficiencyUnit: EvEfficiencyUnit | null;
};

interface UserState {
    profile: UserProfile;
    isLoading: boolean;
    fetchProfile: () => Promise<void>;
    updateProfileOptimistic: (updates: Partial<UserProfile>) => void;
    getVolumeUnit: () => FuelVolumeUnit;
    getFuelEconomyUnit: () => FuelEfficiencyUnit;
    getEvEfficiencyUnit: () => EvEfficiencyUnit;
}

export const useUserStore = create<UserState>((set, get) => ({
    profile: {
        displayName: null,
        avatarUrl: null,
        currency: '₹', // Default fallback
        distanceUnit: 'km', // Default fallback
        email: undefined,
        hasLlmKey: false,
        hasOpenAiKey: false,
        hasDeepseekKey: false,
        preferredProvider: 'gemini',
        electricityTariffPerKwh: null,
        petrolPriceReference: null,
        iceReferenceEfficiency: null,
        evEfficiencyUnit: null,
    },
    isLoading: true,

    fetchProfile: async () => {
        set({ isLoading: true });
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data, error } = await supabase
                .from("users")
                .select("display_name, avatar_url, currency, distance_unit, encrypted_llm_key, encrypted_openai_key, encrypted_deepseek_key, preferred_llm_provider, electricity_tariff_per_kwh, petrol_price_reference, ice_reference_efficiency, ev_efficiency_unit")
                .eq("id", user.id)
                .single();

            if (error) {
                // A PostgrestError logs as `{}` through the Next.js overlay, which
                // hides the one thing that matters — usually a column that exists
                // in the code but not yet in the database.
                console.error(
                    `Error fetching profile: ${error.message}`,
                    { code: error.code, details: error.details, hint: error.hint },
                );
                set({ isLoading: false });
                return;
            }

            set({
                profile: {
                    displayName: data?.display_name || null,
                    avatarUrl: data?.avatar_url || null,
                    currency: data?.currency || '₹',
                    distanceUnit: (data?.distance_unit as DistanceUnit) || 'km',
                    email: user.email,
                    hasLlmKey: !!data?.encrypted_llm_key,
                    hasOpenAiKey: !!data?.encrypted_openai_key,
                    hasDeepseekKey: !!data?.encrypted_deepseek_key,
                    preferredProvider: ((data?.preferred_llm_provider as ProviderPreference | null) || 'gemini'),
                    electricityTariffPerKwh: data?.electricity_tariff_per_kwh ?? null,
                    petrolPriceReference: data?.petrol_price_reference ?? null,
                    iceReferenceEfficiency: data?.ice_reference_efficiency ?? null,
                    evEfficiencyUnit:
                        typeof data?.ev_efficiency_unit === 'string' && isEvEfficiencyUnit(data.ev_efficiency_unit)
                            ? data.ev_efficiency_unit
                            : null,
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
        return 'MPG (US)';
    },

    getEvEfficiencyUnit: () => {
        const { profile } = get();
        return profile.evEfficiencyUnit ?? getDefaultEvEfficiencyUnit(profile.distanceUnit);
    }
}));
