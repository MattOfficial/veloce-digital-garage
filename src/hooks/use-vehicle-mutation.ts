"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { BadgeDefinition } from "@/lib/badges";
import { useVehicleStore } from "@/store/vehicle-store";
import { ui } from "@/content/en/ui";

/**
 * The write path every vehicle form shares: call a server action, decide
 * whether it worked, refresh the client store *and* the router cache, announce
 * it, and surface anything the action refused.
 *
 * Doing this by hand in every modal produced seventeen slightly different
 * versions — some forgot `router.refresh()`, some skipped the try/catch, some
 * showed a toast on failure. The behaviour belongs in one place.
 */

/** What every mutating server action in this app resolves to. */
export type MutationResult = {
    success: boolean;
    error?: string;
    newBadges?: BadgeDefinition[];
};

export interface RunMutationOptions {
    successMessage?: string;
    /** Shown when the action reports failure without a message of its own. */
    failureMessage: string;
    onSuccess?: () => void;
}

const BADGE_TOAST_DELAY_MS = 500;

export function useVehicleMutation() {
    const router = useRouter();
    const { fetchVehicles } = useVehicleStore();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const clearError = useCallback(() => setError(null), []);

    const run = useCallback(
        (action: () => Promise<MutationResult>, options: RunMutationOptions) => {
            setError(null);

            startTransition(async () => {
                try {
                    const result = await action();

                    if (!result.success) {
                        setError(result.error || options.failureMessage);
                        return;
                    }

                    // Badges land after the save toast so they read as a reward
                    // rather than competing with the confirmation.
                    result.newBadges?.forEach((badge) =>
                        setTimeout(
                            () =>
                                toast.success(`🏆 Unlocked: ${badge.name}!`, {
                                    description: badge.description,
                                }),
                            BADGE_TOAST_DELAY_MS,
                        ),
                    );

                    await fetchVehicles();
                    router.refresh();

                    if (options.successMessage) {
                        toast.success(options.successMessage);
                    }

                    options.onSuccess?.();
                } catch {
                    setError(ui.common.unexpectedError);
                }
            });
        },
        [fetchVehicles, router],
    );

    return { run, isPending, error, setError, clearError };
}
