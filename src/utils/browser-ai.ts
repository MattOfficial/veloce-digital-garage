import type {
    CopilotRequestMessage,
    CopilotResponseBody,
    CopilotResponseSource,
    CopilotIntent,
    CopilotVehicleContext,
    PendingAction,
} from "@/types/ai";

type BrowserAiAvailability = "available" | "downloadable" | "downloading" | "unavailable";

type BrowserLanguageModelAvailabilityOptions = {
    expectedInputs?: Array<{ type: "text"; languages?: string[] }>;
    expectedOutputs?: Array<{ type: "text"; languages?: string[] }>;
};

type BrowserLanguageModelSession = {
    prompt: (
        input: string,
        options?: {
            responseConstraint?: Record<string, unknown>;
            omitResponseConstraintInput?: boolean;
            signal?: AbortSignal;
        },
    ) => Promise<string>;
    destroy?: () => void | Promise<void>;
};

type BrowserLanguageModelFactory = {
    availability: (options?: BrowserLanguageModelAvailabilityOptions) => Promise<BrowserAiAvailability>;
    create: (options?: BrowserLanguageModelAvailabilityOptions) => Promise<BrowserLanguageModelSession>;
};

type BrowserCopilotResponse = CopilotResponseBody & {
    pendingAction?: PendingAction;
};

const LANGUAGE_MODEL_CREATE_TIMEOUT_MS = 5000;
const LANGUAGE_MODEL_PROMPT_TIMEOUT_MS = 8000;

const DEFAULT_LANGUAGE_MODEL_OPTIONS: BrowserLanguageModelAvailabilityOptions = {
    expectedInputs: [{ type: "text", languages: ["en"] }],
    expectedOutputs: [{ type: "text", languages: ["en"] }],
};

const BROWSER_COPILOT_SCHEMA = {
    type: "object",
    additionalProperties: false,
    properties: {
        intent: {
            type: "string",
            enum: ["app_scoped_chat"],
        },
        content: { type: "string" },
        pendingAction: {
            anyOf: [
                { type: "null" },
                {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        type: {
                            type: "string",
                            enum: ["log_fuel_draft", "log_maintenance_draft"],
                        },
                        payload: {
                            type: "object",
                        },
                    },
                    required: ["type", "payload"],
                },
            ],
        },
    },
    required: ["intent", "content", "pendingAction"],
} satisfies Record<string, unknown>;

function getLanguageModelFactory(): BrowserLanguageModelFactory | null {
    if (typeof window === "undefined") {
        return null;
    }

    const maybeFactory = (window as typeof window & { LanguageModel?: BrowserLanguageModelFactory }).LanguageModel;
    return maybeFactory ?? null;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
        return await Promise.race([
            promise,
            new Promise<T>((_, reject) => {
                timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
            }),
        ]);
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
}

function isEdgeBrowser() {
    if (typeof navigator === "undefined") {
        return false;
    }

    return navigator.userAgent.includes("Edg/");
}

function parseNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
        const parsedValue = Number(value);
        return Number.isFinite(parsedValue) ? parsedValue : null;
    }

    return null;
}

function parseNonEmptyString(value: unknown): string | null {
    return typeof value === "string" && value.trim() !== "" ? value : null;
}

function parsePendingAction(type: unknown, payload: unknown): PendingAction | undefined {
    if (!payload || typeof payload !== "object") {
        return undefined;
    }

    const payloadRecord = payload as Record<string, unknown>;

    if (type === "log_fuel_draft") {
        const vehicleId = parseNonEmptyString(payloadRecord.vehicle_id);
        const cost = parseNumber(payloadRecord.cost);
        const volume = parseNumber(payloadRecord.volume);
        const odometer = parseNumber(payloadRecord.odometer);

        if (!vehicleId || cost === null || volume === null || odometer === null) {
            return undefined;
        }

        return {
            type,
            payload: {
                vehicle_id: vehicleId,
                cost,
                volume,
                odometer,
                date: parseNonEmptyString(payloadRecord.date) ?? new Date().toISOString().split("T")[0],
            },
        };
    }

    if (type === "log_maintenance_draft") {
        const vehicleId = parseNonEmptyString(payloadRecord.vehicle_id);
        const serviceType = parseNonEmptyString(payloadRecord.service_type);
        const cost = parseNumber(payloadRecord.cost);

        if (!vehicleId || !serviceType || cost === null) {
            return undefined;
        }

        return {
            type,
            payload: {
                vehicle_id: vehicleId,
                service_type: serviceType,
                cost,
                date: parseNonEmptyString(payloadRecord.date) ?? new Date().toISOString().split("T")[0],
                notes: parseNonEmptyString(payloadRecord.notes) ?? undefined,
                receipt_url: parseNonEmptyString(payloadRecord.receipt_url) ?? undefined,
            },
        };
    }

    return undefined;
}

function stripMarkdownFences(value: string) {
    const trimmed = value.trim();
    if (!trimmed.startsWith("```")) {
        return trimmed;
    }

    return trimmed
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
}

function parseBrowserCopilotResponse(rawResponse: string): BrowserCopilotResponse | null {
    try {
        const parsed = JSON.parse(stripMarkdownFences(rawResponse)) as {
            intent?: unknown;
            content?: unknown;
            pendingAction?: { type?: unknown; payload?: unknown } | null;
        };

        if (parsed.intent !== "app_scoped_chat" || typeof parsed.content !== "string" || parsed.content.trim() === "") {
            return null;
        }

        const pendingAction = parsed.pendingAction
            ? parsePendingAction(parsed.pendingAction.type, parsed.pendingAction.payload)
            : undefined;

        return {
            role: "assistant",
            content: parsed.content.trim(),
            pendingAction,
            source: "edge-local" satisfies CopilotResponseSource,
            intent: "app_scoped_chat" satisfies CopilotIntent,
        };
    } catch {
        return null;
    }
}

function buildBrowserCopilotPrompt(messages: CopilotRequestMessage[], vehicles: CopilotVehicleContext[]) {
    const conversation = messages
        .slice(-10)
        .map((message, index) => ({
            index: index + 1,
            role: message.role,
            content: message.content,
        }));

    const today = new Date().toISOString().split("T")[0];

    return `
You are "Veloce Copilot", an in-app assistant for a vehicle tracking application.

Current date: ${today}

Garage:
${JSON.stringify(vehicles, null, 2)}

Recent conversation:
${JSON.stringify(conversation, null, 2)}

Respond ONLY as valid JSON with this exact shape:
{
  "intent": "app_scoped_chat",
  "content": "string",
  "pendingAction": null | {
    "type": "log_fuel_draft" | "log_maintenance_draft",
    "payload": object
  }
}

Rules:
1. Stay strictly within vehicle ownership, fuel, charging, maintenance, garage tracking, and Veloce feature-help topics.
2. The current request is conversational app-scoped chat, not a deterministic analytics query.
3. If the user asks for advice or explanation, answer directly and concisely.
4. Do NOT ask for cost, volume, odometer, or service details unless the user is explicitly asking to log an event.
5. If the request is out of scope, set "pendingAction" to null and politely refuse in "content".
6. If the user explicitly asks to log fuel or charging, only create "log_fuel_draft" when vehicle_id, cost, volume, and odometer are all known.
7. If the user explicitly asks to log maintenance, only create "log_maintenance_draft" when vehicle_id, service_type, and cost are all known.
8. If any required detail is missing or the vehicle match is ambiguous, ask one concise follow-up question in "content" and set "pendingAction" to null.
9. Map vehicles by nickname, make, or model when unambiguous.
10. Use YYYY-MM-DD dates when a tool payload needs a date.
11. Never include markdown fences or extra commentary outside the JSON object.
`.trim();
}

export function supportsEdgeBrowserAi() {
    return isEdgeBrowser() && getLanguageModelFactory() !== null;
}

export async function getEdgeBrowserAiAvailability(): Promise<BrowserAiAvailability> {
    if (!supportsEdgeBrowserAi()) {
        return "unavailable";
    }

    try {
        const languageModel = getLanguageModelFactory();
        if (!languageModel) {
            return "unavailable";
        }

        return await languageModel.availability(DEFAULT_LANGUAGE_MODEL_OPTIONS);
    } catch {
        return "unavailable";
    }
}

export async function promptEdgeBrowserCopilot(
    messages: CopilotRequestMessage[],
    vehicles: CopilotVehicleContext[],
): Promise<BrowserCopilotResponse | null> {
    if (!supportsEdgeBrowserAi()) {
        return null;
    }

    const languageModel = getLanguageModelFactory();
    if (!languageModel) {
        return null;
    }

    const availability = await languageModel.availability(DEFAULT_LANGUAGE_MODEL_OPTIONS);
    if (availability !== "available") {
        return null;
    }

    let session: BrowserLanguageModelSession | null = null;

    try {
        session = await withTimeout(
            languageModel.create(DEFAULT_LANGUAGE_MODEL_OPTIONS),
            LANGUAGE_MODEL_CREATE_TIMEOUT_MS,
            "Timed out while starting the Edge local model.",
        );
        const prompt = buildBrowserCopilotPrompt(messages, vehicles);

        try {
            const promptController = new AbortController();
            const rawResponse = await withTimeout(
                session.prompt(prompt, {
                    responseConstraint: BROWSER_COPILOT_SCHEMA,
                    omitResponseConstraintInput: true,
                    signal: promptController.signal,
                }),
                LANGUAGE_MODEL_PROMPT_TIMEOUT_MS,
                "Timed out while waiting for the Edge local model.",
            ).catch((error) => {
                promptController.abort();
                throw error;
            });

            return parseBrowserCopilotResponse(rawResponse);
        } catch {
            const promptController = new AbortController();
            const rawResponse = await withTimeout(
                session.prompt(prompt, { signal: promptController.signal }),
                LANGUAGE_MODEL_PROMPT_TIMEOUT_MS,
                "Timed out while waiting for the Edge local model.",
            ).catch((error) => {
                promptController.abort();
                throw error;
            });
            return parseBrowserCopilotResponse(rawResponse);
        }
    } catch (error) {
        console.warn("Edge browser copilot failed:", error);
        return null;
    } finally {
        if (session?.destroy) {
            await Promise.resolve(session.destroy());
        }
    }
}
