import { describe, it, expect } from "vitest";
import {
    normalizeServiceType,
    serviceTypesMatch,
    isRoutineServiceType,
    getVehicleCurrentOdometer,
    getVehicleServiceInterval,
    getServiceReminderStatus,
    VEHICLE_SERVICE_INTERVAL_NAME,
} from "@/utils/vehicle-metrics";
import type { ServiceReminder } from "@/types/database";

function makeReminder(overrides: Partial<ServiceReminder> = {}): ServiceReminder {
    return {
        id: "r1",
        vehicle_id: "v1",
        service_type: "Oil Change",
        recurring_months: 6,
        recurring_distance: 10000,
        last_completed_date: "2024-01-01",
        last_completed_odometer: 50000,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        ...overrides,
    };
}

describe("normalizeServiceType", () => {
    it("lowercases the input", () => {
        expect(normalizeServiceType("Oil Change")).toBe("oil change");
    });

    it("replaces special characters with spaces", () => {
        expect(normalizeServiceType("Oil/Change")).toBe("oil change");
        expect(normalizeServiceType("Tyre-Rotation")).toBe("tyre rotation");
    });

    it("trims leading and trailing whitespace", () => {
        expect(normalizeServiceType("  oil change  ")).toBe("oil change");
    });

    it("collapses multiple special chars to a single space", () => {
        expect(normalizeServiceType("brake!!fluid")).toBe("brake fluid");
    });
});

describe("serviceTypesMatch", () => {
    it("returns true for identical service types", () => {
        expect(serviceTypesMatch("Oil Change", "Oil Change")).toBe(true);
    });

    it("returns true when one is a substring of the other (case-insensitive)", () => {
        expect(serviceTypesMatch("Scheduled Service", "service")).toBe(true);
        expect(serviceTypesMatch("service", "Scheduled Service")).toBe(true);
    });

    it("returns false for completely different service types", () => {
        expect(serviceTypesMatch("Oil Change", "Tyre Rotation")).toBe(false);
    });

    it("returns false when left is empty (normalizes to '')", () => {
        expect(serviceTypesMatch("", "Oil Change")).toBe(false);
    });

    it("returns false when right is empty", () => {
        expect(serviceTypesMatch("Oil Change", "")).toBe(false);
    });

    it("returns false when both are empty", () => {
        expect(serviceTypesMatch("", "")).toBe(false);
    });
});

describe("isRoutineServiceType", () => {
    it("returns true for types containing 'service'", () => {
        expect(isRoutineServiceType("Scheduled Service")).toBe(true);
        expect(isRoutineServiceType("Full Service")).toBe(true);
    });

    it("returns true for types containing 'inspection'", () => {
        expect(isRoutineServiceType("Annual Inspection")).toBe(true);
    });

    it("returns false for non-routine types", () => {
        expect(isRoutineServiceType("Oil Change")).toBe(false);
        expect(isRoutineServiceType("Tyre Rotation")).toBe(false);
    });
});

describe("getVehicleServiceInterval", () => {
    it("returns the reminder named exactly VEHICLE_SERVICE_INTERVAL_NAME", () => {
        const reminders: ServiceReminder[] = [
            makeReminder({ service_type: "Oil Change" }),
            makeReminder({ service_type: VEHICLE_SERVICE_INTERVAL_NAME }),
        ];

        const result = getVehicleServiceInterval(reminders);
        expect(result?.service_type).toBe(VEHICLE_SERVICE_INTERVAL_NAME);
    });

    it("falls back to the first reminder if none matches the name", () => {
        const reminders: ServiceReminder[] = [
            makeReminder({ service_type: "Oil Change" }),
            makeReminder({ service_type: "Tyre Rotation" }),
        ];

        const result = getVehicleServiceInterval(reminders);
        expect(result?.service_type).toBe("Oil Change");
    });

    it("returns null when reminders array is empty", () => {
        expect(getVehicleServiceInterval([])).toBeNull();
    });

    it("returns null when reminders is undefined", () => {
        expect(getVehicleServiceInterval(undefined)).toBeNull();
    });
});

describe("getVehicleCurrentOdometer", () => {
    it("returns baseline_odometer when no other readings exist", () => {
        const vehicle = { baseline_odometer: 5000 };
        expect(getVehicleCurrentOdometer(vehicle)).toBe(5000);
    });

    it("returns the highest odometer among baseline, current_odometer, and fuel_logs", () => {
        const vehicle = {
            baseline_odometer: 5000,
            current_odometer: 6000,
            fuel_logs: [{ odometer: 7000 }, { odometer: 6500 }],
        };
        expect(getVehicleCurrentOdometer(vehicle)).toBe(7000);
    });

    it("includes maintenance_logs in the max calculation", () => {
        const vehicle = {
            baseline_odometer: 5000,
            fuel_logs: [{ odometer: 6000 }],
            maintenance_logs: [{ odometer: 8000 }],
        };
        expect(getVehicleCurrentOdometer(vehicle)).toBe(8000);
    });

    it("ignores null/undefined odometer values in logs", () => {
        const vehicle = {
            baseline_odometer: 5000,
            maintenance_logs: [{ odometer: null }, { odometer: undefined }],
        };
        expect(getVehicleCurrentOdometer(vehicle)).toBe(5000);
    });

    it("handles missing fuel_logs and maintenance_logs arrays gracefully", () => {
        const vehicle = { baseline_odometer: 3000, current_odometer: 3500 };
        expect(getVehicleCurrentOdometer(vehicle)).toBe(3500);
    });
});

describe("getServiceReminderStatus", () => {
    const TODAY = new Date("2024-07-01");

    it("returns healthy when below 80% progress", () => {
        // last done at 50000km, due every 10000km → due at 60000. current: 57000 → 70% progress
        const reminder = makeReminder({
            recurring_distance: 10000,
            last_completed_odometer: 50000,
            recurring_months: null,
            last_completed_date: null,
        });
        const status = getServiceReminderStatus(reminder, 57000, TODAY);
        expect(status.status).toBe("healthy");
        expect(status.distanceDueAt).toBe(60000);
        expect(status.distanceRemaining).toBe(3000);
    });

    it("returns due-soon when distance progress is >= 80%", () => {
        // due at 60000, current: 58500 → 85% progress
        const reminder = makeReminder({
            recurring_distance: 10000,
            last_completed_odometer: 50000,
            recurring_months: null,
            last_completed_date: null,
        });
        const status = getServiceReminderStatus(reminder, 58500, TODAY);
        expect(status.status).toBe("due-soon");
    });

    it("returns overdue when distance remaining is <= 0", () => {
        const reminder = makeReminder({
            recurring_distance: 10000,
            last_completed_odometer: 50000,
            recurring_months: null,
            last_completed_date: null,
        });
        const status = getServiceReminderStatus(reminder, 62000, TODAY);
        expect(status.status).toBe("overdue");
        expect(status.distanceRemaining).toBeLessThan(0);
    });

    it("returns overdue when the due date is in the past", () => {
        // last done 2024-01-01, due every 1 month → due 2024-02-01 (before TODAY=July 1)
        const reminder = makeReminder({
            recurring_months: 1,
            last_completed_date: "2024-01-01",
            recurring_distance: null,
            last_completed_odometer: null,
        });
        const status = getServiceReminderStatus(reminder, 55000, TODAY);
        expect(status.status).toBe("overdue");
        expect(status.daysRemaining).toBeLessThan(0);
    });

    it("returns needs-baseline when recurring_distance set but last_completed_odometer is null", () => {
        const reminder = makeReminder({
            recurring_distance: 10000,
            last_completed_odometer: null,
            recurring_months: null,
            last_completed_date: null,
        });
        const status = getServiceReminderStatus(reminder, 55000, TODAY);
        expect(status.status).toBe("needs-baseline");
        expect(status.missingDistanceBaseline).toBe(true);
    });

    it("returns needs-baseline when recurring_months set but last_completed_date is null", () => {
        const reminder = makeReminder({
            recurring_months: 6,
            last_completed_date: null,
            recurring_distance: null,
            last_completed_odometer: null,
        });
        const status = getServiceReminderStatus(reminder, 55000, TODAY);
        expect(status.status).toBe("needs-baseline");
        expect(status.missingTimeBaseline).toBe(true);
    });

    it("uses the max of distance and time progress for overallProgress", () => {
        // 90% distance progress + 50% time progress → overallProgress should be 0.90
        const reminder = makeReminder({
            recurring_distance: 10000,
            last_completed_odometer: 50000,
            recurring_months: 12,
            last_completed_date: "2024-01-01", // 6 months ago → ~50% time
        });
        const status = getServiceReminderStatus(reminder, 59000, TODAY); // 90% distance
        expect(status.overallProgress).toBeCloseTo(0.9, 1);
        expect(status.status).toBe("due-soon");
    });
});
