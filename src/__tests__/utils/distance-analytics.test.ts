import { describe, it, expect } from "vitest";
import {
    getVehicleDistanceSummary,
    getVehicleLifetimeDistanceSummary,
    getGarageDistanceSummary,
    getGarageLifetimeDistanceSummary,
    createTrailingDayRange,
    createTrailingMonthRange,
} from "@/utils/distance-analytics";
import type { FuelLog, VehicleWithLogs } from "@/types/database";

function makeLog(overrides: Partial<FuelLog> = {}): FuelLog {
    return {
        id: "log-1",
        vehicle_id: "v-1",
        date: "2024-01-15",
        odometer: 5000,
        fuel_volume: 10,
        total_cost: 20,
        calculated_efficiency: null,
        energy_type: "fuel",
        fill_type: "full",
        estimated_range: null,
        created_at: "2024-01-15T10:00:00Z",
        ...overrides,
    };
}

function makeVehicle(overrides: Partial<VehicleWithLogs> = {}): VehicleWithLogs {
    return {
        id: "v-1",
        user_id: "u-1",
        make: "Toyota",
        model: "Camry",
        year: 2022,
        baseline_odometer: 1000,
        current_odometer: null,
        image_url: null,
        vin: null,
        license_plate: null,
        color: null,
        nickname: null,
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

const RANGE_JAN = { start: "2024-01-01", end: "2024-01-31" };

describe("getVehicleDistanceSummary", () => {
    it("returns empty summary when no fuel logs exist", () => {
        const vehicle = makeVehicle({ fuel_logs: [] });
        const result = getVehicleDistanceSummary(vehicle, RANGE_JAN);
        expect(result.hasSufficientData).toBe(false);
        expect(result.value).toBeNull();
        expect(result.coverage).toBe("none");
    });

    it("returns empty summary when no log falls within or before range end", () => {
        // Log is in February, but we query January
        const vehicle = makeVehicle({
            fuel_logs: [makeLog({ date: "2024-02-15", odometer: 5000 })],
        });
        const result = getVehicleDistanceSummary(vehicle, RANGE_JAN);
        expect(result.hasSufficientData).toBe(false);
    });

    it("uses baseline_odometer as start when no log exists before range start", () => {
        // Baseline: 1000. Log in Jan at 5000 → distance = 4000
        const vehicle = makeVehicle({
            baseline_odometer: 1000,
            fuel_logs: [makeLog({ date: "2024-01-15", odometer: 5000 })],
        });
        const result = getVehicleDistanceSummary(vehicle, RANGE_JAN);
        expect(result.hasSufficientData).toBe(true);
        expect(result.value).toBe(4000);
        expect(result.usesBaselineFallback).toBe(true);
        expect(result.coverage).toBe("partial");
    });

    it("uses the last log before range start as the start reading", () => {
        // Dec log at 3000 (before Jan), Jan log at 5000 → distance = 2000
        const vehicle = makeVehicle({
            baseline_odometer: 1000,
            fuel_logs: [
                makeLog({ id: "dec", date: "2023-12-15", odometer: 3000 }),
                makeLog({ id: "jan", date: "2024-01-15", odometer: 5000 }),
            ],
        });
        const result = getVehicleDistanceSummary(vehicle, RANGE_JAN);
        expect(result.value).toBe(2000);
        expect(result.usesBaselineFallback).toBe(false);
        expect(result.coverage).toBe("full");
    });

    it("returns 0 (clamped) if end reading is less than start reading", () => {
        const vehicle = makeVehicle({
            baseline_odometer: 6000,
            fuel_logs: [makeLog({ date: "2024-01-15", odometer: 5000 })],
        });
        const result = getVehicleDistanceSummary(vehicle, RANGE_JAN);
        expect(result.value).toBe(0);
    });
});

describe("getVehicleLifetimeDistanceSummary", () => {
    it("returns empty when no fuel logs", () => {
        const vehicle = makeVehicle({ fuel_logs: [] });
        const result = getVehicleLifetimeDistanceSummary(vehicle);
        expect(result.hasSufficientData).toBe(false);
    });

    it("returns latestOdometer minus baseline", () => {
        const vehicle = makeVehicle({
            baseline_odometer: 1000,
            fuel_logs: [
                makeLog({ date: "2024-01-01", odometer: 3000 }),
                makeLog({ date: "2024-06-01", odometer: 8000 }),
            ],
        });
        const result = getVehicleLifetimeDistanceSummary(vehicle);
        expect(result.value).toBe(7000);
        expect(result.coverage).toBe("full");
    });
});

describe("getGarageDistanceSummary", () => {
    it("returns empty summary for empty vehicles array", () => {
        const result = getGarageDistanceSummary([], RANGE_JAN);
        expect(result.hasSufficientData).toBe(false);
        expect(result.totalVehicles).toBe(0);
    });

    it("aggregates distance across multiple vehicles", () => {
        const v1 = makeVehicle({
            id: "v1",
            baseline_odometer: 1000,
            fuel_logs: [makeLog({ date: "2024-01-15", odometer: 3000 })],
        });
        const v2 = makeVehicle({
            id: "v2",
            baseline_odometer: 2000,
            fuel_logs: [makeLog({ id: "log2", date: "2024-01-20", odometer: 5000 })],
        });

        const result = getGarageDistanceSummary([v1, v2], RANGE_JAN);
        expect(result.hasSufficientData).toBe(true);
        // v1: 3000 - 1000 = 2000; v2: 5000 - 2000 = 3000; total = 5000
        expect(result.value).toBe(5000);
        expect(result.contributingVehicles).toBe(2);
    });

    it("returns partial coverage when some vehicles have no data", () => {
        const v1 = makeVehicle({
            id: "v1",
            baseline_odometer: 1000,
            fuel_logs: [makeLog({ date: "2024-01-15", odometer: 3000 })],
        });
        const v2 = makeVehicle({ id: "v2", fuel_logs: [] });

        const result = getGarageDistanceSummary([v1, v2], RANGE_JAN);
        expect(result.hasSufficientData).toBe(true);
        expect(result.coverage).toBe("partial");
        expect(result.contributingVehicles).toBe(1);
    });

    it("returns no data when all vehicles have no logs", () => {
        const v1 = makeVehicle({ id: "v1", fuel_logs: [] });
        const v2 = makeVehicle({ id: "v2", fuel_logs: [] });

        const result = getGarageDistanceSummary([v1, v2], RANGE_JAN);
        expect(result.hasSufficientData).toBe(false);
    });
});

describe("getGarageLifetimeDistanceSummary", () => {
    it("returns empty for empty fleet", () => {
        const result = getGarageLifetimeDistanceSummary([]);
        expect(result.hasSufficientData).toBe(false);
        expect(result.totalVehicles).toBe(0);
    });

    it("aggregates lifetime distances", () => {
        const v1 = makeVehicle({
            id: "v1",
            baseline_odometer: 0,
            fuel_logs: [makeLog({ date: "2024-01-01", odometer: 10000 })],
        });
        const v2 = makeVehicle({
            id: "v2",
            baseline_odometer: 0,
            fuel_logs: [makeLog({ id: "l2", date: "2024-01-01", odometer: 5000 })],
        });

        const result = getGarageLifetimeDistanceSummary([v1, v2]);
        expect(result.value).toBe(15000);
        expect(result.coverage).toBe("full");
    });

    it("returns partial coverage if only some vehicles have logs", () => {
        const v1 = makeVehicle({
            id: "v1",
            baseline_odometer: 0,
            fuel_logs: [makeLog({ date: "2024-01-01", odometer: 10000 })],
        });
        const v2 = makeVehicle({ id: "v2", fuel_logs: [] });

        const result = getGarageLifetimeDistanceSummary([v1, v2]);
        expect(result.coverage).toBe("partial");
    });
});

describe("createTrailingDayRange", () => {
    it("creates a range from N days ago to today", () => {
        const endDate = new Date("2024-06-15");
        const range = createTrailingDayRange(7, endDate);
        expect(range.end).toBe(endDate);
        // 7 days before June 15 = June 8
        const start = range.start as Date;
        expect(start.toISOString().slice(0, 10)).toBe("2024-06-08");
    });
});

describe("createTrailingMonthRange", () => {
    it("creates a range from N months ago to today", () => {
        const endDate = new Date("2024-06-15");
        const range = createTrailingMonthRange(3, endDate);
        expect(range.end).toBe(endDate);
        const start = range.start as Date;
        expect(start.toISOString().slice(0, 10)).toBe("2024-03-15");
    });
});
