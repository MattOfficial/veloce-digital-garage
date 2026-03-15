import type {
    CopilotAnalyticsQuery,
    CopilotRequestMessage,
    CopilotVehicleContext,
    PendingAction,
} from "@/types/ai";
import { classifyCopilotIntent } from "@/utils/copilot-intents";
import { detectExplicitDraftIntent } from "@/utils/copilot-draft-intent";

export type CopilotClientRoute =
    | { kind: "cancel_draft" }
    | { kind: "local_nlp"; draftIntent: PendingAction["type"]; reason: "explicit_log" | "draft_follow_up" }
    | { kind: "guardrail_refusal"; refusalMessage: string }
    | { kind: "server_analytics"; query: CopilotAnalyticsQuery }
    | { kind: "server_attachments" }
    | { kind: "browser_local_chat" }
    | { kind: "server_chat" };

type GetCopilotClientRouteArgs = {
    messages: CopilotRequestMessage[];
    vehicles: CopilotVehicleContext[];
    selectedVehicleId?: string | null;
    hasAttachments: boolean;
    activeDraftIntent: PendingAction["type"] | null;
    browserAiAvailable: boolean;
};

const cancelDraftPattern = /\b(cancel|never mind|nevermind|forget it|stop|dismiss)\b/i;
const draftFollowUpPattern =
    /\d|\b(today|yesterday|lit(?:er|re)s?|gallons?|kwh|odometer|odo|cost|price|rupees?|dollars?|service|repair|oil|brake|battery|tire|tyre|filter|inspection|wash|detail)\b/i;

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

function shouldContinueDraftFollowUp(content: string, vehicles: CopilotVehicleContext[]) {
    const trimmed = content.trim();
    if (!trimmed || cancelDraftPattern.test(trimmed)) {
        return false;
    }

    return draftFollowUpPattern.test(trimmed) || mentionsKnownVehicle(trimmed, vehicles);
}

export function getCopilotClientRoute({
    messages,
    vehicles,
    selectedVehicleId,
    hasAttachments,
    activeDraftIntent,
    browserAiAvailable,
}: GetCopilotClientRouteArgs): CopilotClientRoute {
    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
    const content = latestUserMessage?.content ?? "";

    if (hasAttachments) {
        return { kind: "server_attachments" };
    }

    if (activeDraftIntent && cancelDraftPattern.test(content)) {
        return { kind: "cancel_draft" };
    }

    const explicitDraftIntent = detectExplicitDraftIntent(content);
    if (explicitDraftIntent) {
        return {
            kind: "local_nlp",
            draftIntent: explicitDraftIntent,
            reason: "explicit_log",
        };
    }

    if (activeDraftIntent && shouldContinueDraftFollowUp(content, vehicles)) {
        return {
            kind: "local_nlp",
            draftIntent: activeDraftIntent,
            reason: "draft_follow_up",
        };
    }

    const classifiedIntent = classifyCopilotIntent(messages, vehicles, selectedVehicleId);

    if (classifiedIntent.intent === "out_of_scope") {
        return {
            kind: "guardrail_refusal",
            refusalMessage: classifiedIntent.refusalMessage ?? "I’m scoped to Veloce, your garage data, and vehicle ownership topics only.",
        };
    }

    if (classifiedIntent.intent === "analytics_query" && classifiedIntent.query) {
        return {
            kind: "server_analytics",
            query: classifiedIntent.query,
        };
    }

    if (browserAiAvailable) {
        return { kind: "browser_local_chat" };
    }

    return { kind: "server_chat" };
}
