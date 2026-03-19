import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCopilotClientRoute } from "@/utils/copilot-routing";
import type { CopilotRequestMessage, CopilotVehicleContext, CopilotAnalyticsQuery, CopilotDateRange } from "@/types/ai";

// Mock the two dependencies that have complex external logic
vi.mock("@/utils/copilot-intents", () => ({
    classifyCopilotIntent: vi.fn(),
}));
vi.mock("@/utils/copilot-draft-intent", () => ({
    detectExplicitDraftIntent: vi.fn(),
}));

import { classifyCopilotIntent } from "@/utils/copilot-intents";
import { detectExplicitDraftIntent } from "@/utils/copilot-draft-intent";

const mockClassify = vi.mocked(classifyCopilotIntent);
const mockDetect = vi.mocked(detectExplicitDraftIntent);

const VEHICLE: CopilotVehicleContext = {
    id: "v-1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    nickname: "My Car",
    odometer: 12000,
};

const MESSAGES: CopilotRequestMessage[] = [
    { role: "user", content: "how far did I drive this month?" },
];

const DATE_RANGE: CopilotDateRange = {
    preset: "this_month",
    start: "2024-03-01",
    end: "2024-03-31",
    label: "March 2024",
};

const ANALYTICS_QUERY: CopilotAnalyticsQuery = {
    metric: "distance",
    scope: "garage",
    vehicleIds: [],
    dateRange: DATE_RANGE,
    question: "How far?",
};

function makeArgs(
    overrides: Partial<Parameters<typeof getCopilotClientRoute>[0]> = {},
): Parameters<typeof getCopilotClientRoute>[0] {
    return {
        messages: MESSAGES,
        vehicles: [VEHICLE],
        selectedVehicleId: undefined,
        hasAttachments: false,
        activeDraftIntent: null,
        browserAiAvailable: false,
        ...overrides,
    };
}

describe("getCopilotClientRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: no explicit draft intent, app-scoped chat
        mockDetect.mockReturnValue(null);
        mockClassify.mockReturnValue({ intent: "app_scoped_chat" });
    });

    it("returns server_attachments when hasAttachments is true", () => {
        const result = getCopilotClientRoute(makeArgs({ hasAttachments: true }));
        expect(result.kind).toBe("server_attachments");
    });

    it("returns cancel_draft when activeDraftIntent is set and message matches cancel pattern", () => {
        const result = getCopilotClientRoute(
            makeArgs({
                activeDraftIntent: "log_fuel_draft",
                messages: [{ role: "user", content: "never mind" }],
            }),
        );
        expect(result.kind).toBe("cancel_draft");
    });

    it("does not cancel draft when message does not match cancel pattern", () => {
        mockClassify.mockReturnValue({ intent: "app_scoped_chat" });
        const result = getCopilotClientRoute(
            makeArgs({
                activeDraftIntent: "log_fuel_draft",
                messages: [{ role: "user", content: "add 50 litres" }],
            }),
        );
        expect(result.kind).not.toBe("cancel_draft");
    });

    it("returns local_nlp with explicit_log reason when explicit draft intent detected", () => {
        mockDetect.mockReturnValue("log_fuel_draft");
        const result = getCopilotClientRoute(makeArgs());
        expect(result.kind).toBe("local_nlp");
        if (result.kind === "local_nlp") {
            expect(result.draftIntent).toBe("log_fuel_draft");
            expect(result.reason).toBe("explicit_log");
        }
    });

    it("returns local_nlp with draft_follow_up reason for active draft and follow-up message", () => {
        // detectExplicitDraftIntent returns null, but message has a number (follow-up pattern)
        mockDetect.mockReturnValue(null);
        const result = getCopilotClientRoute(
            makeArgs({
                activeDraftIntent: "log_fuel_draft",
                messages: [{ role: "user", content: "50 litres" }],
            }),
        );
        expect(result.kind).toBe("local_nlp");
        if (result.kind === "local_nlp") {
            expect(result.reason).toBe("draft_follow_up");
        }
    });

    it("returns guardrail_refusal for out_of_scope intent", () => {
        mockClassify.mockReturnValue({
            intent: "out_of_scope",
            refusalMessage: "I can't help with that.",
        });
        const result = getCopilotClientRoute(makeArgs());
        expect(result.kind).toBe("guardrail_refusal");
        if (result.kind === "guardrail_refusal") {
            expect(result.refusalMessage).toBe("I can't help with that.");
        }
    });

    it("returns guardrail_refusal with default message when refusalMessage is null", () => {
        mockClassify.mockReturnValue({ intent: "out_of_scope", refusalMessage: undefined });
        const result = getCopilotClientRoute(makeArgs());
        expect(result.kind).toBe("guardrail_refusal");
        if (result.kind === "guardrail_refusal") {
            expect(result.refusalMessage).toBeTruthy();
        }
    });

    it("returns server_analytics when intent is analytics_query with a query", () => {
        mockClassify.mockReturnValue({
            intent: "analytics_query",
            query: ANALYTICS_QUERY,
        });
        const result = getCopilotClientRoute(makeArgs());
        expect(result.kind).toBe("server_analytics");
        if (result.kind === "server_analytics") {
            expect(result.query).toEqual(ANALYTICS_QUERY);
        }
    });

    it("returns browser_local_chat when browser AI is available and intent is not out_of_scope or analytics", () => {
        mockClassify.mockReturnValue({ intent: "app_scoped_chat" });
        const result = getCopilotClientRoute(makeArgs({ browserAiAvailable: true }));
        expect(result.kind).toBe("browser_local_chat");
    });

    it("returns server_chat as fallback when browser AI is not available", () => {
        mockClassify.mockReturnValue({ intent: "app_scoped_chat" });
        const result = getCopilotClientRoute(makeArgs({ browserAiAvailable: false }));
        expect(result.kind).toBe("server_chat");
    });

    it("attachments take priority over cancel_draft", () => {
        const result = getCopilotClientRoute(
            makeArgs({
                hasAttachments: true,
                activeDraftIntent: "log_fuel_draft",
                messages: [{ role: "user", content: "cancel" }],
            }),
        );
        expect(result.kind).toBe("server_attachments");
    });

    it("explicit draft intent takes priority over draft follow-up", () => {
        mockDetect.mockReturnValue("log_maintenance_draft");
        const result = getCopilotClientRoute(
            makeArgs({
                activeDraftIntent: "log_fuel_draft",
                messages: [{ role: "user", content: "add an oil change" }],
            }),
        );
        expect(result.kind).toBe("local_nlp");
        if (result.kind === "local_nlp") {
            expect(result.reason).toBe("explicit_log");
            expect(result.draftIntent).toBe("log_maintenance_draft");
        }
    });
});
