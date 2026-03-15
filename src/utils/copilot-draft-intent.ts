import type { PendingAction } from "@/types/ai";

export type LocalDraftIntent = PendingAction["type"];

const questionStarterPattern = /^(how|what|why|when|where|which|who|can|could|should|would|will|is|are|do|does|did)\b/i;
const directLogCommandPattern = /^(?:please\s+)?(?:log|record|add|save|track)\b/i;
const requestLogCommandPattern = /\b(?:can|could|would|will)\s+you\s+(?:log|record|add|save|track)\b/i;
const firstPersonPattern = /\b(i|we|my)\b/i;
const recentEventPattern = /\b(just|today|yesterday|tonight|this morning|this afternoon|this evening)\b/i;
const fuelKeywordPattern = /\b(fuel|gas|petrol|diesel|fill|refuel|pump|tank|charge|charging|recharge|ev|plug|kwh)\b/i;
const maintenanceKeywordPattern = /\b(fix|repair|maintenance|oil|service|tire|tyre|brake|engine|mechanic|gearbox|transmission|battery|wash|detail|filter|fluid|replace|change|inspection|install)\b/i;
const fuelActionPattern = /\b(filled up|fill up|refueled|refuelled|got gas|got petrol|got diesel|tanked up|charged up|plugged in|charging session|put in)\b/i;
const maintenanceActionPattern = /\b(oil change|got serviced|service done|replaced|fixed|repaired|installed|rotated|detailed|washed)\b/i;

function hasQuestionSignal(content: string): boolean {
    const trimmed = content.trim();
    return trimmed.includes("?") || questionStarterPattern.test(trimmed);
}

export function detectExplicitDraftIntent(content: string): LocalDraftIntent | null {
    const trimmed = content.trim();
    if (!trimmed) {
        return null;
    }

    const normalizedContent = trimmed.toLowerCase();
    const hasDirectLogCommand = directLogCommandPattern.test(trimmed) || requestLogCommandPattern.test(trimmed);
    const hasFirstPerson = firstPersonPattern.test(normalizedContent);
    const mentionsRecentEvent = recentEventPattern.test(normalizedContent);
    const isQuestionLike = hasQuestionSignal(trimmed);

    if (isQuestionLike && !hasDirectLogCommand) {
        return null;
    }

    const fuelSignal = fuelKeywordPattern.test(normalizedContent) && (
        hasDirectLogCommand ||
        (fuelActionPattern.test(normalizedContent) && (hasFirstPerson || mentionsRecentEvent))
    );

    const maintenanceSignal = maintenanceKeywordPattern.test(normalizedContent) && (
        hasDirectLogCommand ||
        (maintenanceActionPattern.test(normalizedContent) && (hasFirstPerson || mentionsRecentEvent))
    );

    if (fuelSignal && !maintenanceSignal) {
        return "log_fuel_draft";
    }

    if (maintenanceSignal && !fuelSignal) {
        return "log_maintenance_draft";
    }

    if (fuelSignal) {
        return "log_fuel_draft";
    }

    if (maintenanceSignal) {
        return "log_maintenance_draft";
    }

    return null;
}
