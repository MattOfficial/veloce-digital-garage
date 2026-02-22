import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';

interface UserProfile {
    displayName: string | null;
    avatarUrl: string | null;
    currency: string;
    email: string | undefined;
}

interface UserState {
    profile: UserProfile;
    isLoading: boolean;
    fetchProfile: () => Promise<void>;
    updateProfileOptimistic: (updates: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>((set) => ({
    profile: {
        displayName: null,
        avatarUrl: null,
        currency: '₹', // Default fallback
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
                .select("display_name, avatar_url, currency")
                .eq("id", user.id)
                .single();

            set({
                profile: {
                    displayName: data?.display_name || null,
                    avatarUrl: data?.avatar_url || null,
                    currency: data?.currency || '₹',
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
    }
}));
