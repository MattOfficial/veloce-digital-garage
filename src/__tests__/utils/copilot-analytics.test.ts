import { describe, it, expect } from "vitest";
import { computeCopilotAnalytics } from "@/utils/copilot-analytics";
import type { CopilotAnalyticsQuery, CopilotDateRange } from "@/types/ai";
import type { FuelLog, VehicleWithLogs, MaintenanceLog } from "@/types/database";

function makeVehicle(overrides: Partial<VehicleWithLogs> = {}): VehicleWithLogs {
    return {
        id: "v-1",
        user_id: "u-1",
        make: "Toyota",
        model: "Camry",
        year: 2022,
        baseline_odometer: 1000,
        current_odometer: 15000,
        image_url: null,
        vin: null,
        license_plate: null,
        color: null,
        nickname: "My Car",
        engine_type: null,
        transmission: null,
        notes: null,
        custom_fields: null,
        tyre_info: null,
        vehicle_type: "car",
        powertrain: "ice",
        battery_capacity_kwh: null,
        created_at: "2024-01-01T00:00:00Z",
        fuel_logs: [],
        maintenance_logs: [],
        custom_logs: [],
        service_reminders: [],
        ...overrides,
    };
}

function makeFuelLog(overrides: Partial<FuelLog> = {}): FuelLog {
    return {
        id: "fl-1",
        vehicle_id: "v-1",
        date: "2024-03-15",
        odometer: 5000,
        fuel_volume: 40,
        total_cost: 80,
        calculated_efficiency: null,
        energy_type: "fuel",
        fill_type: "full",
        estimated_range: null,
        created_at: "2024-03-15T10:00:00Z",
        ...overrides,
    };
}

function makeMaintenanceLog(overrides: Partial<MaintenanceLog> = {}): MaintenanceLog {
    return {
        id: "ml-1",
        vehicle_id: "v-1",
        date: "2024-03-10",
        service_type: "Oil Change",
        cost: 150,
        odometer: 4900,
        notes: null,
        created_at: "2024-03-10T10:00:00Z",
        ...overrides,
    };
}

const DATE_RANGE: CopilotDateRange = {
    preset: "this_month",
    start: "2024-03-01",
    end: "2024-03-31",
    label: "March 2024",
};

function makeQuery(overrides: Partial<CopilotAnalyticsQuery> = {}): CopilotAnalyticsQuery {
    return {
        metric: "distance",
        scope: "garage",
        vehicleIds: ["v-1"],
        dateRange: DATE_RANGE,
        question: "How far did I drive?",
        ...overrides,
    };
}

describe("computeCopilotAnalytics", () => {
    const profile = { currency: "USD", distanceUnit: "km" as const };

    // ── No matching vehicles ─────────────────────────────────────────────────
    it("returns no-data result when scoped vehicles is empty (vehicle scope, no match)", () => {
        const query = makeQuery({ scope: "vehicle", vehicleIds: ["nonexistent"] });
        const result = computeCopilotAnalytics(query, [makeVehicle()], profile);
        expect(result.hasSufficientData).toBe(false);
        expect(result.value).toBeNull();
        expect(result.vehicleIds).toHaveLength(0);
    });

    // ── Garage scope: all vehicles included ─────────────────────────────────
    it("includes all vehicles when scope is garage", () => {
        const v1 = makeVehicle({ id: "v-1" });
        const v2 = makeVehicle({ id: "v-2" });
        const query = makeQuery({ scope: "garage", vehicleIds: [] });
        const result = computeCopilotAnalytics(query, [v1, v2], profile);
        // Both vehicles included but no logs → insufficient data for distance
        expect(result.hasSufficientData).toBe(false);
    });

    // ── Vehicle scope: only matching vehicles included ───────────────────────
    it("filters by vehicleIds when scope is vehicle", () => {
        const v1 = makeVehicle({ id: "v-1", fuel_logs: [makeFuelLog({ date: "2024-03-15", odometer: 5000 })] });
        const v2 = makeVehicle({ id: "v-2", fuel_logs: [makeFuelLog({ id: "fl-2", vehicle_id: "v-2", date: "2024-03-15", odometer: 4000 })] });
        const query = makeQuery({ scope: "vehicle", vehicleIds: ["v-1"] });
        const result = computeCopilotAnalytics(query, [v1, v2], profile);
        expect(result.vehicleIds).toContain("v-1");
        expect(result.vehicleIds).not.toContain("v-2");
    });

    // ── fuel_spend ───────────────────────────────────────────────────────────
    it("calculates fuel_spend correctly", () => {
        const vehicle = makeVehicle({
            fuel_logs: [
                makeFuelLog({ date: "2024-03-10", total_cost: 60 }),
                makeFuelLog({ id: "fl-2", date: "2024-03-20", total_cost: 80 }),
                makeFuelLog({ id: "fl-3", date: "2024-02-05", total_cost: 999 }), // outside range
            ],
        });
        const query = makeQuery({ metric: "fuel_spend" });
        const result = computeCopilotAnalytics(query, [vehicle], profile);
        expect(result.value).toBe(140);
        expect(result.unit).toBe("USD");
        expect(result.hasSufficientData).toBe(true);
    });

    // ── maintenance_spend ────────────────────────────────────────────────────
    it("calculates maintenance_spend correctly", () => {
        const vehicle = makeVehicle({
            maintenance_logs: [
                makeMaintenanceLog({ date: "2024-03-05", cost: 200 }),
                makeMaintenanceLog({ id: "ml-2", date: "2024-02-10", cost: 999 }), // outside range
            ],
        });
        const query = makeQuery({ metric: "maintenance_spend" });
        const result = computeCopilotAnalytics(query, [vehicle], profile);
        expect(result.value).toBe(200);
    });

    // ── total_spend ──────────────────────────────────────────────────────────
    it("calculates total_spend as sum of fuel + maintenance", () => {
        const vehicle = makeVehicle({
            fuel_logs: [makeFuelLog({ total_cost: 100 })],
            maintenance_logs: [makeMaintenanceLog({ cost: 50 })],
        });
        const query = makeQuery({ metric: "total_spend" });
        const result = computeCopilotAnalytics(query, [vehicle], profile);
        expect(result.value).toBe(150);
    });

    // ── service_count ────────────────────────────────────────────────────────
    it("counts maintenance events in range for service_count", () => {
        const vehicle = makeVehicle({
            maintenance_logs: [
                makeMaintenanceLog({ date: "2024-03-05" }),
                makeMaintenanceLog({ id: "ml-2", date: "2024-03-20" }),
                makeMaintenanceLog({ id: "ml-3", date: "2024-02-01" }), // outside
            ],
        });
        const query = makeQuery({ metric: "service_count" });
        const result = computeCopilotAnalytics(query, [vehicle], profile);
        expect(result.value).toBe(2);
        expect(result.unit).toBeNull();
    });

    // ── refuel_count ─────────────────────────────────────────────────────────
    it("counts fuel events in range for refuel_count", () => {
        const vehicle = makeVehicle({
            fuel_logs: [
                makeFuelLog({ date: "2024-03-05" }),
                makeFuelLog({ id: "fl-2", date: "2024-03-25" }),
            ],
        });
        const query = makeQuery({ metric: "refuel_count" });
        const result = computeCopilotAnalytics(query, [vehicle], profile);
        expect(result.value).toBe(2);
    });

    // ── odometer ─────────────────────────────────────────────────────────────
    it("returns current odometer for odometer metric", () => {
        const vehicle = makeVehicle({ current_odometer: 12345 });
        const query = makeQuery({ metric: "odometer", scope: "vehicle", vehicleIds: ["v-1"] });
        const result = computeCopilotAnalytics(query, [vehicle], profile);
        expect(result.value).toBe(12345);
        expect(result.label).toBe("Current odometer");
    });

    // ── fuel_efficiency ──────────────────────────────────────────────────────
    it("returns null efficiency when no closed fuel segments in range", () => {
        const vehicle = makeVehicle({ fuel_logs: [] });
        const query = makeQuery({ metric: "fuel_efficiency" });
        const result = computeCopilotAnalytics(query, [vehicle], profile);
        expect(result.hasSufficientData).toBe(false);
        expect(result.value).toBeNull();
    });

    it("calculates fuel efficiency from closed segments in range", () => {
        // Full fill: baseline=1000, fill at 1200 → 200km / 40L = 5 km/L
        const vehicle = makeVehicle({
            baseline_odometer: 1000,
            fuel_logs: [
                makeFuelLog({ id: "f1", date: "2024-03-15", odometer: 1200, fuel_volume: 40, fill_type: "full" }),
            ],
        });
        const query = makeQuery({ metric: "fuel_efficiency" });
        const result = computeCopilotAnalytics(query, [vehicle], profile);
        expect(result.hasSufficientData).toBe(true);
        expect(result.value).toBeCloseTo(5, 2);
        expect(result.unit).toBe("km/L");
    });

    // ── Unrecognized metric ──────────────────────────────────────────────────
    it("returns unsupported result for unknown metric", () => {
        const query = makeQuery({ metric: "unknown_metric" as CopilotAnalyticsQuery["metric"] });
        const vehicle = makeVehicle();
        const result = computeCopilotAnalytics(query, [vehicle], profile);
        expect(result.hasSufficientData).toBe(false);
        expect(result.label).toBe("Unsupported metric");
    });

    // ── Summary strings ──────────────────────────────────────────────────────
    it("includes vehicle nickname in summary when single vehicle", () => {
        const vehicle = makeVehicle({
            nickname: "Speedy",
            fuel_logs: [makeFuelLog({ total_cost: 100 })],
        });
        const query = makeQuery({ metric: "fuel_spend" });
        const result = computeCopilotAnalytics(query, [vehicle], profile);
        expect(result.summary).toContain("Speedy");
    });

    it("uses 'your garage' in summary for multiple vehicles", () => {
        const v1 = makeVehicle({ id: "v-1", fuel_logs: [makeFuelLog({ total_cost: 50 })] });
        const v2 = makeVehicle({ id: "v-2", fuel_logs: [makeFuelLog({ id: "fl-2", total_cost: 50 })] });
        const query = makeQuery({ metric: "fuel_spend", scope: "garage" });
        const result = computeCopilotAnalytics(query, [v1, v2], profile);
        expect(result.summary).toContain("your garage");
    });
});
