import type {
    CopilotRequestMessage,
    CopilotResponseBody,
    CopilotResponseSource,
    CopilotIntent,
    CopilotVehicleContext,
} from "@/types/ai";

type BrowserAiAvailability = "available" | "downloadable" | "downloading" | "unavailable";
export type BrowserAiProvider = "edge" | "chrome";
export type BrowserAiStatus = {
    provider: BrowserAiProvider | null;
    availability: BrowserAiAvailability;
};

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
    promptStreaming?: (
        input: string,
        options?: {
            responseConstraint?: Record<string, unknown>;
            omitResponseConstraintInput?: boolean;
            signal?: AbortSignal;
        },
    ) => ReadableStream<string> & AsyncIterable<string>;
    destroy?: () => void | Promise<void>;
};

type BrowserLanguageModelFactory = {
    availability: (options?: BrowserLanguageModelAvailabilityOptions) => Promise<BrowserAiAvailability>;
    create: (options?: BrowserLanguageModelAvailabilityOptions) => Promise<BrowserLanguageModelSession>;
};

type BrowserCopilotResponse = CopilotResponseBody;

type PromptBrowserCopilotOptions = {
    onPartialContent?: (content: string, source: CopilotResponseSource) => void;
};

const LANGUAGE_MODEL_CREATE_TIMEOUT_MS = 10000;
const LANGUAGE_MODEL_FIRST_CHUNK_TIMEOUT_MS = 20000;
const LANGUAGE_MODEL_CHUNK_IDLE_TIMEOUT_MS = 12000;
const LANGUAGE_MODEL_PROMPT_TIMEOUT_MS = 20000;

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
    },
    required: ["intent", "content"],
} satisfies Record<string, unknown>;

function getLanguageModelFactory(): BrowserLanguageModelFactory | null {
    if (typeof window === "undefined") {
        return null;
    }

    const maybeFactory = (window as typeof window & { LanguageModel?: BrowserLanguageModelFactory }).LanguageModel;
    return maybeFactory ?? null;
}

function getBrowserAiProvider(): BrowserAiProvider | null {
    if (typeof navigator === "undefined") {
        return null;
    }

    const userAgent = navigator.userAgent;

    if (userAgent.includes("Edg/")) {
        return "edge";
    }

    if (
        userAgent.includes("Chrome/")
        && !userAgent.includes("Edg/")
        && !userAgent.includes("OPR/")
        && navigator.vendor === "Google Inc."
    ) {
        return "chrome";
    }

    return null;
}

function getBrowserAiSource(provider: BrowserAiProvider): CopilotResponseSource {
    return provider === "chrome" ? "chrome-local" : "edge-local";
}

function getBrowserAiDisplayName(provider: BrowserAiProvider) {
    return provider === "chrome" ? "Chrome Gemini Nano" : "Edge local model";
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

function parseBrowserCopilotResponse(
    rawResponse: string,
    provider: BrowserAiProvider,
): BrowserCopilotResponse | null {
    try {
        const parsed = JSON.parse(stripMarkdownFences(rawResponse)) as {
            intent?: unknown;
            content?: unknown;
        };

        if (parsed.intent !== "app_scoped_chat" || typeof parsed.content !== "string" || parsed.content.trim() === "") {
            return null;
        }

        return {
            role: "assistant",
            content: parsed.content.trim(),
            source: getBrowserAiSource(provider),
            intent: "app_scoped_chat" satisfies CopilotIntent,
        };
    } catch {
        return null;
    }
}

type JsonStringExtraction = {
    value: string;
    complete: boolean;
};

function extractJsonStringField(rawResponse: string, fieldName: string): JsonStringExtraction | null {
    const fieldIndex = rawResponse.indexOf(`"${fieldName}"`);
    if (fieldIndex === -1) {
        return null;
    }

    let cursor = fieldIndex + fieldName.length + 2;

    while (cursor < rawResponse.length && /\s/.test(rawResponse[cursor])) {
        cursor += 1;
    }

    if (rawResponse[cursor] !== ":") {
        return null;
    }

    cursor += 1;
    while (cursor < rawResponse.length && /\s/.test(rawResponse[cursor])) {
        cursor += 1;
    }

    if (rawResponse[cursor] !== "\"") {
        return null;
    }

    cursor += 1;

    let value = "";

    while (cursor < rawResponse.length) {
        const char = rawResponse[cursor];

        if (char === "\"") {
            return { value, complete: true };
        }

        if (char === "\\") {
            const nextChar = rawResponse[cursor + 1];
            if (!nextChar) {
                break;
            }

            switch (nextChar) {
                case "\"":
                case "\\":
                case "/":
                    value += nextChar;
                    cursor += 2;
                    continue;
                case "b":
                    value += "\b";
                    cursor += 2;
                    continue;
                case "f":
                    value += "\f";
                    cursor += 2;
                    continue;
                case "n":
                    value += "\n";
                    cursor += 2;
                    continue;
                case "r":
                    value += "\r";
                    cursor += 2;
                    continue;
                case "t":
                    value += "\t";
                    cursor += 2;
                    continue;
                case "u": {
                    const unicodeHex = rawResponse.slice(cursor + 2, cursor + 6);
                    if (!/^[0-9a-fA-F]{4}$/.test(unicodeHex)) {
                        return { value, complete: false };
                    }

                    value += String.fromCharCode(Number.parseInt(unicodeHex, 16));
                    cursor += 6;
                    continue;
                }
                default:
                    value += nextChar;
                    cursor += 2;
                    continue;
            }
        }

        value += char;
        cursor += 1;
    }

    return { value, complete: false };
}

function extractPartialBrowserCopilotContent(rawResponse: string) {
    return extractJsonStringField(stripMarkdownFences(rawResponse), "content")?.value ?? null;
}

async function streamBrowserPrompt(
    stream: ReadableStream<string> & AsyncIterable<string>,
    timeoutMessage: string,
    idleTimeoutMessage: string,
    onChunk?: (chunk: string) => void,
): Promise<string> {
    const iterator = stream[Symbol.asyncIterator]();
    let latestChunk = "";
    let timeoutMs = LANGUAGE_MODEL_FIRST_CHUNK_TIMEOUT_MS;
    let timedOutMessage = timeoutMessage;

    while (true) {
        const nextResult = await withTimeout(iterator.next(), timeoutMs, timedOutMessage);
        if (nextResult.done) {
            return latestChunk;
        }

        latestChunk = nextResult.value;
        onChunk?.(latestChunk);
        timeoutMs = LANGUAGE_MODEL_CHUNK_IDLE_TIMEOUT_MS;
        timedOutMessage = idleTimeoutMessage;
    }
}

function buildBrowserCopilotPrompt(messages: CopilotRequestMessage[], vehicles: CopilotVehicleContext[]) {
    const garage = vehicles.map((vehicle) => ({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        nickname: vehicle.nickname,
        odometer: vehicle.odometer,
    }));

    const conversation = messages
        .slice(-6)
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
${JSON.stringify(garage, null, 2)}

Recent conversation:
${JSON.stringify(conversation, null, 2)}

Respond ONLY as valid JSON with this exact shape:
{
  "intent": "app_scoped_chat",
  "content": "string"
}

Rules:
1. Stay strictly within vehicle ownership, fuel, charging, maintenance, garage tracking, and Veloce feature-help topics.
2. This mode is for low-risk conversational text chat only. Never create tools, log drafts, or action payloads.
3. If the user asks for advice or explanation, answer directly and concisely.
4. If the user asks for exact calculations from their garage records, receipt analysis, or anything requiring uploaded files, explain briefly that the app will handle that with its secure server tools.
5. If the request is out of scope, politely refuse in "content".
6. Map vehicles by nickname, make, or model when unambiguous.
7. Never include markdown fences or extra commentary outside the JSON object.
8. Keep "content" concise by default, ideally under 90 words unless the user asks for detail.
`.trim();
}

export function supportsBrowserAi() {
    return getBrowserAiProvider() !== null && getLanguageModelFactory() !== null;
}

export async function getBrowserAiAvailability(): Promise<BrowserAiStatus> {
    const provider = getBrowserAiProvider();

    if (!provider || !supportsBrowserAi()) {
        return {
            provider,
            availability: "unavailable",
        };
    }

    try {
        const languageModel = getLanguageModelFactory();
        if (!languageModel) {
            return {
                provider,
                availability: "unavailable",
            };
        }

        return {
            provider,
            availability: await languageModel.availability(DEFAULT_LANGUAGE_MODEL_OPTIONS),
        };
    } catch {
        return {
            provider,
            availability: "unavailable",
        };
    }
}

export async function promptBrowserCopilot(
    messages: CopilotRequestMessage[],
    vehicles: CopilotVehicleContext[],
    options: PromptBrowserCopilotOptions = {},
): Promise<BrowserCopilotResponse | null> {
    const provider = getBrowserAiProvider();

    if (!provider || !supportsBrowserAi()) {
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
            `Timed out while starting ${getBrowserAiDisplayName(provider)}.`,
        );
        const prompt = buildBrowserCopilotPrompt(messages, vehicles);
        const source = getBrowserAiSource(provider);

        const streamResponse = async (useConstraint: boolean) => {
            if (!session?.promptStreaming) {
                return null;
            }

            const promptController = new AbortController();
            const streamOptions = useConstraint
                ? {
                    responseConstraint: BROWSER_COPILOT_SCHEMA,
                    omitResponseConstraintInput: true,
                    signal: promptController.signal,
                }
                : { signal: promptController.signal };

            const rawResponse = await streamBrowserPrompt(
                session.promptStreaming(prompt, streamOptions),
                `Timed out while waiting for ${getBrowserAiDisplayName(provider)} to start responding.`,
                `Timed out while waiting for ${getBrowserAiDisplayName(provider)} to keep responding.`,
                (chunk) => {
                    const partialContent = extractPartialBrowserCopilotContent(chunk);
                    if (partialContent !== null) {
                        options.onPartialContent?.(partialContent, source);
                    }
                },
            ).catch((error) => {
                promptController.abort();
                throw error;
            });

            return rawResponse;
        };

        try {
            const rawResponse = await streamResponse(true) ?? await (async () => {
                const promptController = new AbortController();
                return withTimeout(
                    session.prompt(prompt, {
                        responseConstraint: BROWSER_COPILOT_SCHEMA,
                        omitResponseConstraintInput: true,
                        signal: promptController.signal,
                    }),
                    LANGUAGE_MODEL_PROMPT_TIMEOUT_MS,
                    `Timed out while waiting for ${getBrowserAiDisplayName(provider)}.`,
                ).catch((error) => {
                    promptController.abort();
                    throw error;
                });
            })();
            return parseBrowserCopilotResponse(rawResponse, provider);
        } catch {
            const rawResponse = await streamResponse(false) ?? await (async () => {
                const promptController = new AbortController();
                return withTimeout(
                    session.prompt(prompt, { signal: promptController.signal }),
                    LANGUAGE_MODEL_PROMPT_TIMEOUT_MS,
                    `Timed out while waiting for ${getBrowserAiDisplayName(provider)}.`,
                ).catch((error) => {
                    promptController.abort();
                    throw error;
                });
            })();
            return parseBrowserCopilotResponse(rawResponse, provider);
        }
    } catch (error) {
        console.warn(`${getBrowserAiDisplayName(provider)} copilot failed:`, error);
        return null;
    } finally {
        if (session?.destroy) {
            await Promise.resolve(session.destroy());
        }
    }
}
