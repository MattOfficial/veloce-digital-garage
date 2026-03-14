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

export interface CopilotResponseBody {
    role: "assistant";
    content: string;
    pendingAction?: PendingAction;
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
