import { describe, it, expect } from "vitest";
import { buildFuelAnalytics } from "@/utils/fuel-analytics";
import type { FuelLog } from "@/types/database";

function makeLog(overrides: Partial<FuelLog> = {}): FuelLog {
    return {
        id: "log-1",
        vehicle_id: "v-1",
        date: "2024-01-01",
        odometer: 1000,
        fuel_volume: 10,
        total_cost: 20,
        calculated_efficiency: null,
        energy_type: "fuel",
        fill_type: "full",
        estimated_range: null,
        created_at: "2024-01-01T10:00:00Z",
        ...overrides,
    };
}

describe("buildFuelAnalytics", () => {
    it("returns empty streams when logs array is empty", () => {
        const result = buildFuelAnalytics([], 1000);
        expect(result.fuel.logs).toHaveLength(0);
        expect(result.fuel.closed_segments).toHaveLength(0);
        expect(result.charge.logs).toHaveLength(0);
        expect(result.charge.closed_segments).toHaveLength(0);
    });

    it("splits logs into fuel and charge streams", () => {
        const logs = [
            makeLog({ id: "f1", energy_type: "fuel", fill_type: "full", odometer: 1100 }),
            makeLog({ id: "c1", energy_type: "charge", fill_type: "full", odometer: 1200 }),
        ];

        const result = buildFuelAnalytics(logs, 1000);
        expect(result.fuel.logs).toHaveLength(1);
        expect(result.charge.logs).toHaveLength(1);
    });

    it("computes correct efficiency for a single full fill", () => {
        // Baseline odometer: 1000, fill at 1100 → 100 km distance, 10L volume → 10 km/L
        const logs = [
            makeLog({ id: "f1", odometer: 1100, fuel_volume: 10, fill_type: "full" }),
        ];

        const result = buildFuelAnalytics(logs, 1000);
        expect(result.fuel.closed_segments).toHaveLength(1);
        const seg = result.fuel.closed_segments[0];
        expect(seg.distance).toBe(100);
        expect(seg.volume).toBe(10);
        expect(seg.derived_efficiency).toBeCloseTo(10, 3);
    });

    it("accumulates partial fills into the next full fill", () => {
        const logs = [
            makeLog({ id: "p1", odometer: 1050, fuel_volume: 5, fill_type: "partial", date: "2024-01-01" }),
            makeLog({ id: "f1", odometer: 1100, fuel_volume: 8, fill_type: "full", date: "2024-01-02" }),
        ];

        const result = buildFuelAnalytics(logs, 1000);
        expect(result.fuel.closed_segments).toHaveLength(1);
        const seg = result.fuel.closed_segments[0];
        expect(seg.distance).toBe(100); // 1100 - 1000
        expect(seg.volume).toBe(13);     // 5 + 8
        expect(seg.cost).toBe(40);       // 20 + 20 (default total_cost = 20 each)
    });

    it("marks logs after last full fill as pending_full", () => {
        const logs = [
            makeLog({ id: "f1", odometer: 1100, fill_type: "full", date: "2024-01-01" }),
            makeLog({ id: "p1", odometer: 1150, fill_type: "partial", date: "2024-01-02" }),
        ];

        const result = buildFuelAnalytics(logs, 1000);
        const pending = result.fuel.logs.find((l) => l.id === "p1");
        expect(pending?.pending_full).toBe(true);
    });

    it("creates multiple closed segments from multiple full fills", () => {
        const logs = [
            makeLog({ id: "f1", odometer: 1100, fuel_volume: 10, fill_type: "full", date: "2024-01-01" }),
            makeLog({ id: "f2", odometer: 1200, fuel_volume: 10, fill_type: "full", date: "2024-01-02" }),
        ];

        const result = buildFuelAnalytics(logs, 1000);
        expect(result.fuel.closed_segments).toHaveLength(2);
        expect(result.fuel.closed_segments[0].end_odometer).toBe(1100);
        expect(result.fuel.closed_segments[1].end_odometer).toBe(1200);
    });

    it("sorts out-of-order logs before processing", () => {
        const logs = [
            makeLog({ id: "f2", odometer: 1200, fuel_volume: 10, fill_type: "full", date: "2024-01-02" }),
            makeLog({ id: "f1", odometer: 1100, fuel_volume: 10, fill_type: "full", date: "2024-01-01" }),
        ];

        const result = buildFuelAnalytics(logs, 1000);
        expect(result.fuel.closed_segments).toHaveLength(2);
        // First segment goes up to 1100, second up to 1200
        expect(result.fuel.closed_segments[0].end_odometer).toBe(1100);
    });

    it("normalizes null energy_type to 'fuel'", () => {
        const logs = [
            makeLog({ id: "f1", energy_type: undefined as unknown as "fuel", fill_type: "full", odometer: 1100 }),
        ];

        const result = buildFuelAnalytics(logs, 1000);
        expect(result.fuel.logs).toHaveLength(1);
    });

    it("normalizes null fill_type to 'full'", () => {
        const logs = [
            makeLog({ id: "f1", fill_type: undefined as unknown as "full", odometer: 1100 }),
        ];

        const result = buildFuelAnalytics(logs, 1000);
        // Treated as full fill, so should create a segment
        expect(result.fuel.closed_segments).toHaveLength(1);
    });

    it("does not create a segment when distance is 0", () => {
        // Fill at same odometer as baseline → distance = 0, no segment
        const logs = [
            makeLog({ id: "f1", odometer: 1000, fuel_volume: 10, fill_type: "full" }),
        ];

        const result = buildFuelAnalytics(logs, 1000);
        expect(result.fuel.closed_segments).toHaveLength(0);
        const log = result.fuel.logs[0];
        expect(log.contributes_to_efficiency).toBe(false);
    });

    it("sets segment_closed_at_log_id for all logs in a segment", () => {
        const logs = [
            makeLog({ id: "p1", odometer: 1050, fill_type: "partial", date: "2024-01-01" }),
            makeLog({ id: "f1", odometer: 1100, fill_type: "full", date: "2024-01-02" }),
        ];

        const result = buildFuelAnalytics(logs, 1000);
        const partialLog = result.fuel.logs.find((l) => l.id === "p1");
        const fullLog = result.fuel.logs.find((l) => l.id === "f1");
        expect(partialLog?.segment_closed_at_log_id).toBe("f1");
        expect(fullLog?.segment_closed_at_log_id).toBe("f1");
    });

    it("charge stream computes efficiency independently from fuel stream", () => {
        const logs = [
            makeLog({ id: "c1", energy_type: "charge", odometer: 1200, fuel_volume: 20, fill_type: "full" }),
        ];

        const result = buildFuelAnalytics(logs, 1000);
        expect(result.charge.closed_segments).toHaveLength(1);
        expect(result.charge.closed_segments[0].derived_efficiency).toBeCloseTo(10, 3); // 200km / 20kWh
        expect(result.fuel.closed_segments).toHaveLength(0);
    });
});
