"use server";

import { createClient } from "@/utils/supabase/server";

import { BADGE_REGISTRY, BadgeDefinition } from "@/lib/badges";

/**
 * Evaluates the user's current stats against all possible badges.
 * Automatically inserts any newly earned badges into `user_badges` and returns them.
 * Call this function asynchronously after successful data mutations (e.g. adding fuel).
 */
export async function evaluateBadges(userId?: string): Promise<BadgeDefinition[]> {
    const supabase = await createClient();

    let targetUserId = userId;
    if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        targetUserId = user.id;
    }

    try {
        // 1. Fetch current badges to avoid re-awarding
        const { data: currentBadgesResult } = await supabase
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', targetUserId);

        const earnedBadgeIds = new Set((currentBadgesResult || []).map(b => b.badge_id));

        // 2. Fetch Aggregates
        const { data: userVehicles } = await supabase
            .from('vehicles')
            .select('id')
            .eq('user_id', targetUserId);

        const vehicleIds = (userVehicles || []).map(v => v.id);

        let totalFuelLogs = 0;
        let totalMaintenanceLogs = 0;

        if (vehicleIds.length > 0) {
            const { count: fCount } = await supabase
                .from('fuel_logs')
                .select('id', { count: 'exact', head: true })
                .in('vehicle_id', vehicleIds);
            totalFuelLogs = fCount || 0;

            const { count: mCount } = await supabase
                .from('maintenance_logs')
                .select('id', { count: 'exact', head: true })
                .in('vehicle_id', vehicleIds);
            totalMaintenanceLogs = mCount || 0;
        }

        // 3. Evaluate criteria
        const newlyEarnedIds: string[] = [];

        if (vehicleIds.length >= 1 && !earnedBadgeIds.has('green_flag')) newlyEarnedIds.push('green_flag');
        if (vehicleIds.length >= 3 && !earnedBadgeIds.has('fleet_manager')) newlyEarnedIds.push('fleet_manager');

        if (totalFuelLogs >= 1 && !earnedBadgeIds.has('first_drop')) newlyEarnedIds.push('first_drop');
        if (totalFuelLogs >= 5 && !earnedBadgeIds.has('daily_driver')) newlyEarnedIds.push('daily_driver');
        if (totalFuelLogs >= 20 && !earnedBadgeIds.has('endurance_racer')) newlyEarnedIds.push('endurance_racer');

        if (totalMaintenanceLogs >= 1 && !earnedBadgeIds.has('wrench_ready')) newlyEarnedIds.push('wrench_ready');
        if (totalMaintenanceLogs >= 5 && !earnedBadgeIds.has('preventative_mindset')) newlyEarnedIds.push('preventative_mindset');

        // Note: ai_mechanic is triggered manually by passing a special parameter or checking the action

        // 4. Insert new badges
        if (newlyEarnedIds.length > 0) {
            const inserts = newlyEarnedIds.map(id => ({
                user_id: targetUserId,
                badge_id: id
            }));

            const { error: insertError } = await supabase
                .from('user_badges')
                .insert(inserts);

            if (insertError) {
                console.error("Failed to insert new badges:", insertError);
                return [];
            }

            // Return the full definitions for the UI to display toasts
            return newlyEarnedIds.map(id => BADGE_REGISTRY[id]).filter(Boolean);
        }

        return [];
    } catch (e) {
        console.error("Error evaluating badges:", e);
        return [];
    }
}

/**
 * Explicit check for AI Mechanic (called specifically when Copilot processes a receipt)
 */
export async function awardAiMechanicBadge(userId?: string): Promise<BadgeDefinition[]> {
    const supabase = await createClient();

    let targetUserId = userId;
    if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        targetUserId = user.id;
    }

    const { data: current } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', targetUserId)
        .eq('badge_id', 'ai_mechanic')
        .single();

    if (!current) {
        const { error } = await supabase
            .from('user_badges')
            .insert({ user_id: targetUserId, badge_id: 'ai_mechanic' });

        if (!error) {
            return [BADGE_REGISTRY['ai_mechanic']];
        }
    }
    return [];
}

/**
 * Fetch all earned badges for the current user to display in the UI.
 */
export async function getUserBadges() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('user_badges')
        .select('badge_id, earned_at')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

    if (error) {
        console.error("Failed to fetch user badges:", error);
        return [];
    }
    return data || [];
}
