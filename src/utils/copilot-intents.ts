import type {
    CopilotAnalyticsQuery,
    CopilotDateRange,
    CopilotDateRangePreset,
    CopilotIntent,
    CopilotQueryMetric,
    CopilotQueryScope,
    CopilotRequestMessage,
    CopilotVehicleContext,
} from "@/types/ai";

type IntentClassification = {
    intent: CopilotIntent;
    query?: CopilotAnalyticsQuery;
    refusalMessage?: string;
};

const quantitativeSignalPattern =
    /\b(how many|how much|what did i spend|what's my|what is my|what was my|average|avg|total|count|number of|current|latest|did i|have i|last week|this week|this month|last month|last 30 days|last 7 days|lately|this year|last year)\b/i;

const appScopedKeywordPattern =
    /\b(vehicle|garage|fuel|gas|petrol|diesel|fill-up|fill up|top-up|top up|refuel|refuelling|refueling|charge|charging|maintenance|service|repair|oil|brake|engine|transmission|gearbox|tyre|tire|battery|odometer|mileage|efficiency|mpg|km\/l|l\/100|range|tracker|trackers|reminder|reminders|receipt|invoice|dashboard|garage data|running cost|vehicle ownership|car|cars|motorcycle|bike|truck|ev|hybrid|veloce)\b/i;

const contextualFollowUpPattern =
    /^(and|also|what about|how about|why|why not|which one|that|this|it|them|those|these|can you elaborate|explain more|make it shorter|shorter|summarize|rephrase)\b/i;

const outOfScopePattern =
    /\b(python|javascript|typescript|java|c\+\+|rust|golang|bash|sql|regex|algorithm|leetcode|essay|poem|story|capital of|prime number|integral|differentiate|homework|exam answer|write code|generate code)\b/i;

const vehicleReferenceAliases = [
    "this vehicle",
    "current vehicle",
    "selected vehicle",
];

function normalizeText(value: string) {
    return value.trim().toLowerCase();
}

function mentionsKnownVehicle(content: string, vehicles: CopilotVehicleContext[]) {
    const normalized = normalizeText(content);

    return vehicles.some((vehicle) => {
        const aliases = [
            vehicle.nickname,
            vehicle.make,
            vehicle.model,
            `${vehicle.make} ${vehicle.model}`,
        ]
            .filter(Boolean)
            .map((alias) => normalizeText(alias as string));

        return aliases.some((alias) => alias.length > 0 && normalized.includes(alias));
    });
}

function isAppScopedMessage(content: string, vehicles: CopilotVehicleContext[]) {
    const normalized = normalizeText(content);

    return appScopedKeywordPattern.test(normalized) || mentionsKnownVehicle(normalized, vehicles);
}

function hasRecentInScopeContext(messages: CopilotRequestMessage[], vehicles: CopilotVehicleContext[]) {
    return messages
        .slice(-4)
        .some((message) => message.role === "user" && isAppScopedMessage(message.content, vehicles));
}

function formatMonthLabel(date: Date) {
    return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function startOfDay(date: Date) {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
}

function endOfDay(date: Date) {
    const next = new Date(date);
    next.setHours(23, 59, 59, 999);
    return next;
}

function toIsoDate(date: Date) {
    return date.toISOString().split("T")[0];
}

function buildDateRange(preset: CopilotDateRangePreset, now = new Date()): CopilotDateRange {
    const today = startOfDay(now);
    const endToday = endOfDay(now);

    switch (preset) {
        case "today":
            return { preset, start: toIsoDate(today), end: toIsoDate(today), label: "today" };
        case "yesterday": {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return { preset, start: toIsoDate(yesterday), end: toIsoDate(yesterday), label: "yesterday" };
        }
        case "last_7_days": {
            const start = new Date(today);
            start.setDate(start.getDate() - 6);
            return { preset, start: toIsoDate(start), end: toIsoDate(today), label: "the last 7 days" };
        }
        case "last_week": {
            const day = today.getDay();
            const mondayOffset = day === 0 ? -6 : 1 - day;
            const thisWeekStart = new Date(today);
            thisWeekStart.setDate(thisWeekStart.getDate() + mondayOffset);
            const lastWeekStart = new Date(thisWeekStart);
            lastWeekStart.setDate(lastWeekStart.getDate() - 7);
            const lastWeekEnd = new Date(thisWeekStart);
            lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
            return { preset, start: toIsoDate(lastWeekStart), end: toIsoDate(lastWeekEnd), label: "last week" };
        }
        case "this_week": {
            const day = today.getDay();
            const mondayOffset = day === 0 ? -6 : 1 - day;
            const start = new Date(today);
            start.setDate(start.getDate() + mondayOffset);
            return { preset, start: toIsoDate(start), end: toIsoDate(today), label: "this week" };
        }
        case "this_month": {
            const start = new Date(today.getFullYear(), today.getMonth(), 1);
            return { preset, start: toIsoDate(start), end: toIsoDate(today), label: "this month" };
        }
        case "last_month": {
            const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const end = new Date(today.getFullYear(), today.getMonth(), 0);
            return { preset, start: toIsoDate(start), end: toIsoDate(end), label: formatMonthLabel(start) };
        }
        case "last_30_days": {
            const start = new Date(today);
            start.setDate(start.getDate() - 29);
            return { preset, start: toIsoDate(start), end: toIsoDate(today), label: "the last 30 days" };
        }
        case "this_year": {
            const start = new Date(today.getFullYear(), 0, 1);
            return { preset, start: toIsoDate(start), end: toIsoDate(today), label: "this year" };
        }
        case "last_year": {
            const start = new Date(today.getFullYear() - 1, 0, 1);
            const end = new Date(today.getFullYear() - 1, 11, 31);
            return { preset, start: toIsoDate(start), end: toIsoDate(end), label: String(start.getFullYear()) };
        }
        case "all_time":
        default:
            return { preset: "all_time", start: "1970-01-01", end: toIsoDate(endToday), label: "all time" };
    }
}

function detectDateRange(content: string): CopilotDateRange {
    const normalized = normalizeText(content);

    if (normalized.includes("today")) return buildDateRange("today");
    if (normalized.includes("yesterday")) return buildDateRange("yesterday");
    if (normalized.includes("last week")) return buildDateRange("last_week");
    if (normalized.includes("this week")) return buildDateRange("this_week");
    if (normalized.includes("last month")) return buildDateRange("last_month");
    if (normalized.includes("this month")) return buildDateRange("this_month");
    if (normalized.includes("last 30 days") || normalized.includes("past 30 days") || normalized.includes("lately")) return buildDateRange("last_30_days");
    if (normalized.includes("last 7 days") || normalized.includes("past 7 days")) return buildDateRange("last_7_days");
    if (normalized.includes("this year")) return buildDateRange("this_year");
    if (normalized.includes("last year")) return buildDateRange("last_year");

    return buildDateRange("all_time");
}

function detectMetric(content: string): CopilotQueryMetric | null {
    const normalized = normalizeText(content);

    if (/\b(odometer|current mileage|mileage reading|odo reading)\b/.test(normalized)) return "odometer";
    if (/\b(how many|count|number of|times)\b/.test(normalized) && /\b(service|serviced|maintenance|repair|oil change)\b/.test(normalized)) return "service_count";
    if (/\b(how many|count|number of|times)\b/.test(normalized) && /\b(refuel|fill|fill-up|fill up|fuel stop|charge session|charging session|top-up|top up)\b/.test(normalized)) return "refuel_count";
    if (/\b(fuel economy|fuel efficiency|mileage|efficiency|km\/l|mpg|l\/100|km\/kwh|mi\/kwh)\b/.test(normalized)) return "fuel_efficiency";
    if (/\b(spend|spent|cost|paid)\b/.test(normalized) && /\b(fuel|gas|petrol|diesel|charge|charging)\b/.test(normalized)) return "fuel_spend";
    if (/\b(spend|spent|cost|paid)\b/.test(normalized) && /\b(maintenance|service|repair|oil|brake|tyre|tire)\b/.test(normalized)) return "maintenance_spend";
    if (/\b(spend|spent|cost|paid|running cost|running costs|expenses?)\b/.test(normalized)) return "total_spend";
    if (/\b(distance|km|kilometers|miles|drive|driven|travel|travelled|traveled)\b/.test(normalized)) return "distance";

    return null;
}

function isAnalyticsLike(content: string, metric: CopilotQueryMetric | null): boolean {
    if (!metric) {
        return false;
    }

    const normalized = normalizeText(content);
    if (metric === "odometer") {
        return true;
    }

    return quantitativeSignalPattern.test(normalized);
}

function resolveVehicleScope(
    content: string,
    vehicles: CopilotVehicleContext[],
    selectedVehicleId?: string | null,
): { scope: CopilotQueryScope; vehicleIds: string[]; clarificationPrompt?: string } {
    const normalized = normalizeText(content);

    if (/\b(all vehicles|whole garage|entire garage|my garage)\b/.test(normalized)) {
        return { scope: "garage", vehicleIds: vehicles.map((vehicle) => vehicle.id) };
    }

    if (selectedVehicleId && vehicleReferenceAliases.some((alias) => normalized.includes(alias))) {
        return { scope: "vehicle", vehicleIds: [selectedVehicleId] };
    }

    const matchedVehicles = vehicles.filter((vehicle) => {
        const aliases = [
            vehicle.nickname,
            vehicle.make,
            vehicle.model,
            `${vehicle.make} ${vehicle.model}`,
        ]
            .filter(Boolean)
            .map((alias) => normalizeText(alias as string));

        return aliases.some((alias) => alias.length > 0 && normalized.includes(alias));
    });

    const uniqueVehicleIds = Array.from(new Set(matchedVehicles.map((vehicle) => vehicle.id)));

    if (uniqueVehicleIds.length === 1) {
        return { scope: "vehicle", vehicleIds: uniqueVehicleIds };
    }

    if (uniqueVehicleIds.length > 1) {
        const labels = matchedVehicles.map((vehicle) => vehicle.nickname || `${vehicle.make} ${vehicle.model}`);
        return {
            scope: "vehicle",
            vehicleIds: uniqueVehicleIds,
            clarificationPrompt: `I found multiple matching vehicles: ${labels.join(", ")}. Which one do you want me to use?`,
        };
    }

    return { scope: "garage", vehicleIds: vehicles.map((vehicle) => vehicle.id) };
}

export function parseAnalyticsQuery(
    content: string,
    vehicles: CopilotVehicleContext[],
    selectedVehicleId?: string | null,
): CopilotAnalyticsQuery | null {
    const metric = detectMetric(content);
    if (!isAnalyticsLike(content, metric)) {
        return null;
    }
    if (!metric) {
        return null;
    }

    const dateRange = detectDateRange(content);
    const scopeResolution = resolveVehicleScope(content, vehicles, selectedVehicleId);

    if (metric === "odometer" && scopeResolution.scope === "garage") {
        return {
            metric,
            scope: "garage",
            vehicleIds: scopeResolution.vehicleIds,
            dateRange,
            question: content,
            selectedVehicleId,
            clarificationPrompt: "Which vehicle's odometer do you want me to use?",
        };
    }

    return {
        metric,
        scope: scopeResolution.scope,
        vehicleIds: scopeResolution.vehicleIds,
        dateRange,
        question: content,
        selectedVehicleId,
        clarificationPrompt: scopeResolution.clarificationPrompt,
    };
}

export function classifyCopilotIntent(
    messages: CopilotRequestMessage[],
    vehicles: CopilotVehicleContext[],
    selectedVehicleId?: string | null,
): IntentClassification {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
    const content = lastUserMessage?.content ?? "";
    const normalized = normalizeText(content);

    if (outOfScopePattern.test(normalized)) {
        return {
            intent: "out_of_scope",
            refusalMessage: "I can help with Veloce features, your garage data, fuel, maintenance, and vehicle ownership questions. I can’t help with coding, essays, or unrelated general questions.",
        };
    }

    const analyticsQuery = parseAnalyticsQuery(content, vehicles, selectedVehicleId);
    if (analyticsQuery) {
        return {
            intent: "analytics_query",
            query: analyticsQuery,
        };
    }

    if (isAppScopedMessage(content, vehicles)) {
        return { intent: "app_scoped_chat" };
    }

    if (contextualFollowUpPattern.test(normalized) && hasRecentInScopeContext(messages.slice(0, -1), vehicles)) {
        return { intent: "app_scoped_chat" };
    }

    return {
        intent: "out_of_scope",
        refusalMessage: "I’m scoped to Veloce, your garage data, and vehicle ownership topics only.",
    };
}
