export const providerPreferences = ["gemini", "openai", "deepseek"] as const;

export type ProviderPreference = (typeof providerPreferences)[number];

export function isProviderPreference(value: string): value is ProviderPreference {
    return providerPreferences.includes(value as ProviderPreference);
}

export interface FuelDraftPayload {
    vehicle_id: string;
    cost: number;
    volume: number;
    odometer: number;
    date: string;
}

export interface MaintenanceDraftPayload {
    vehicle_id: string;
    service_type: string;
    cost: number;
    date: string;
    notes?: string;
    receipt_url?: string;
}

export type CopilotDraftPayload = FuelDraftPayload | MaintenanceDraftPayload;

export type PendingAction =
    | { type: "log_fuel_draft"; payload: FuelDraftPayload }
    | { type: "log_maintenance_draft"; payload: MaintenanceDraftPayload };

export type CopilotIntent =
    | "draft_fuel_log"
    | "draft_maintenance_log"
    | "analytics_query"
    | "app_scoped_chat"
    | "out_of_scope";

export type CopilotResponseSource =
    | "local-nlp"
    | "edge-local"
    | "server-analytics"
    | "server"
    | "server-gemini"
    | "server-openai"
    | "server-deepseek"
    | "guardrail-refusal";

export type CopilotQueryMetric =
    | "distance"
    | "fuel_spend"
    | "maintenance_spend"
    | "total_spend"
    | "fuel_efficiency"
    | "service_count"
    | "refuel_count"
    | "odometer";

export type CopilotQueryScope = "vehicle" | "garage";

export type CopilotDateRangePreset =
    | "today"
    | "yesterday"
    | "last_7_days"
    | "last_week"
    | "this_week"
    | "this_month"
    | "last_month"
    | "last_30_days"
    | "this_year"
    | "last_year"
    | "all_time";

export interface CopilotDateRange {
    preset: CopilotDateRangePreset;
    start: string;
    end: string;
    label: string;
}

export interface CopilotAnalyticsQuery {
    metric: CopilotQueryMetric;
    scope: CopilotQueryScope;
    vehicleIds: string[];
    dateRange: CopilotDateRange;
    question: string;
    selectedVehicleId?: string | null;
    clarificationPrompt?: string;
}

export interface CopilotAnalyticsResult {
    metric: CopilotQueryMetric;
    scope: CopilotQueryScope;
    vehicleIds: string[];
    value: number | null;
    unit: string | null;
    label: string;
    summary: string;
    dateRangeLabel: string;
    hasSufficientData: boolean;
}

export interface CopilotAttachment {
    url: string;
    name: string;
    mimeType: string;
}

export interface CopilotRequestMessage {
    role: "user" | "assistant";
    content: string;
    attachments?: CopilotAttachment[];
}

export interface CopilotVehicleContext {
    id: string;
    make: string;
    model: string;
    year: number;
    nickname: string | null;
    odometer: number;
}

export interface CopilotRequestBody {
    messages: CopilotRequestMessage[];
    vehicles: CopilotVehicleContext[];
    selectedVehicleId?: string | null;
    intentHint?: CopilotIntent;
    query?: CopilotAnalyticsQuery;
}

export interface CopilotResponseBody {
    role: "assistant";
    content: string;
    pendingAction?: PendingAction;
    source?: CopilotResponseSource;
    intent?: CopilotIntent;
    analyticsResult?: CopilotAnalyticsResult;
}

export interface OcrLineItem {
    service: string;
    cost: number | string;
}

export interface OcrExtractedData {
    provider: string;
    date: string;
    total_cost: number | string;
    odometer: number | null;
    line_items: OcrLineItem[];
}
