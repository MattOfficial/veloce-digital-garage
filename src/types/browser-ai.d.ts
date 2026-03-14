type BrowserAiAvailability = "available" | "downloadable" | "downloading" | "unavailable";

interface BrowserLanguageModelAvailabilityOptions {
    expectedInputs?: Array<{ type: "text"; languages?: string[] }>;
    expectedOutputs?: Array<{ type: "text"; languages?: string[] }>;
}

interface BrowserLanguageModelSession {
    prompt: (
        input: string,
        options?: {
            responseConstraint?: Record<string, unknown>;
            omitResponseConstraintInput?: boolean;
            signal?: AbortSignal;
        },
    ) => Promise<string>;
    destroy?: () => void | Promise<void>;
}

interface BrowserLanguageModelFactory {
    availability: (options?: BrowserLanguageModelAvailabilityOptions) => Promise<BrowserAiAvailability>;
    create: (options?: BrowserLanguageModelAvailabilityOptions) => Promise<BrowserLanguageModelSession>;
}

declare global {
    interface Window {
        LanguageModel?: BrowserLanguageModelFactory;
    }
}

export {};

