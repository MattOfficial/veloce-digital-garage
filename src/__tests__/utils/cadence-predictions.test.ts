import { describe, it, expect } from "vitest";
import {
    calculateSmartNextRefill,
    getRefillDisplayString,
    getStatusClassName,
    getStatusIcon,
    type SmartRefillPrediction,
} from "@/utils/cadence-predictions";

// Fixed "today" for deterministic tests
const TODAY = new Date("2024-06-15T12:00:00Z");

describe("calculateSmartNextRefill", () => {
    it("returns insufficient-data when cadenceEndDate is null", () => {
        const result = calculateSmartNextRefill(null, 7, TODAY);
        expect(result.status).toBe("insufficient-data");
        expect(result.adjustedDate).toBeNull();
        expect(result.originalDate).toBeNull();
        expect(result.daysDifference).toBe(0);
        expect(result.wasProjectionPast).toBe(false);
        expect(result.cyclesMissed).toBe(0);
    });

    it("returns insufficient-data when averageDaysBetween is 0", () => {
        const result = calculateSmartNextRefill(new Date("2024-06-10"), 0, TODAY);
        expect(result.status).toBe("insufficient-data");
    });

    it("returns insufficient-data when averageDaysBetween is negative", () => {
        const result = calculateSmartNextRefill(new Date("2024-06-10"), -1, TODAY);
        expect(result.status).toBe("insufficient-data");
    });

    it("returns on-track when projection is more than 2 days in the future", () => {
        // lastFill 10 days ago, average every 14 days → next in 4 days
        const lastFill = new Date("2024-06-05T12:00:00Z");
        const result = calculateSmartNextRefill(lastFill, 14, TODAY);
        expect(result.status).toBe("on-track");
        expect(result.wasProjectionPast).toBe(false);
        expect(result.daysDifference).toBeGreaterThan(2);
    });

    it("returns refuelling-soon when projection is 1-2 days away", () => {
        // lastFill 12 days ago, average every 14 days → next in 2 days
        const lastFill = new Date("2024-06-01T12:00:00Z");
        const result = calculateSmartNextRefill(lastFill, 16, TODAY);
        // 2024-06-01 + 16 days = 2024-06-17 → 2 days from today (June 15)
        expect(result.status).toBe("refuelling-soon");
        expect(result.daysDifference).toBeLessThanOrEqual(2);
        expect(result.daysDifference).toBeGreaterThan(0);
    });

    it("returns refuelling-imminent when projection is today or tomorrow", () => {
        // lastFill 14 days ago, average 14 → next = today
        const lastFill = new Date("2024-06-01T12:00:00Z");
        const result = calculateSmartNextRefill(lastFill, 14, TODAY);
        expect(result.status).toBe("refuelling-imminent");
        expect(result.daysDifference).toBeLessThanOrEqual(1);
        expect(result.wasProjectionPast).toBe(false);
    });

    it("returns overdue when projection is in the past", () => {
        // lastFill 30 days ago, average every 7 days → well overdue
        const lastFill = new Date("2024-05-01T12:00:00Z");
        const result = calculateSmartNextRefill(lastFill, 7, TODAY);
        expect(result.status).toBe("overdue");
        expect(result.wasProjectionPast).toBe(true);
        expect(result.cyclesMissed).toBeGreaterThan(1);
        // adjustedDate should still be in the future
        expect(result.adjustedDate).not.toBeNull();
        expect(result.adjustedDate!.getTime()).toBeGreaterThan(TODAY.getTime());
    });

    it("calculates cyclesMissed correctly for exactly one missed cycle", () => {
        // lastFill 10 days ago, average 7 → first projected was 3 days ago, so 1 cycle missed
        const lastFill = new Date("2024-06-05T12:00:00Z");
        const result = calculateSmartNextRefill(lastFill, 7, TODAY);
        expect(result.status).toBe("overdue");
        expect(result.cyclesMissed).toBeGreaterThanOrEqual(1);
    });

    it("adjustedDate is always in the future for overdue predictions", () => {
        const lastFill = new Date("2024-01-01");
        const result = calculateSmartNextRefill(lastFill, 7, TODAY);
        expect(result.adjustedDate!.getTime()).toBeGreaterThan(TODAY.getTime());
    });
});

describe("getRefillDisplayString", () => {
    function makePrediction(overrides: Partial<SmartRefillPrediction>): SmartRefillPrediction {
        return {
            adjustedDate: new Date("2024-06-20"),
            originalDate: new Date("2024-06-20"),
            status: "on-track",
            message: "On track",
            daysDifference: 5,
            wasProjectionPast: false,
            cyclesMissed: 0,
            ...overrides,
        };
    }

    it("returns insufficient data message when status is insufficient-data", () => {
        const pred = makePrediction({ status: "insufficient-data", adjustedDate: null, originalDate: null });
        expect(getRefillDisplayString(pred, "fuel")).toBe("Insufficient data to predict");
    });

    it("returns unable message when adjustedDate is null (non-insufficient-data)", () => {
        const pred = makePrediction({ status: "on-track", adjustedDate: null });
        expect(getRefillDisplayString(pred, "fuel")).toBe("Unable to calculate prediction");
    });

    it("returns date string for on-track status", () => {
        const pred = makePrediction({ status: "on-track", daysDifference: 5 });
        const result = getRefillDisplayString(pred, "fuel");
        expect(result).not.toContain("refuelling");
        expect(result.length).toBeGreaterThan(0);
    });

    it("includes refuelling-soon message with days for fuel mode", () => {
        const pred = makePrediction({ status: "refuelling-soon", daysDifference: 2 });
        const result = getRefillDisplayString(pred, "fuel");
        expect(result).toContain("refuelling in 2 days");
    });

    it("includes charging-soon message with days for charge mode", () => {
        const pred = makePrediction({ status: "refuelling-soon", daysDifference: 2 });
        const result = getRefillDisplayString(pred, "charge");
        expect(result).toContain("charging in 2 days");
    });

    it("returns 'Today - refuelling due' when daysDifference is 0", () => {
        const pred = makePrediction({ status: "refuelling-imminent", daysDifference: 0 });
        expect(getRefillDisplayString(pred, "fuel")).toContain("Today - refuelling due");
    });

    it("returns 'Tomorrow - refuelling due' when daysDifference is 1", () => {
        const pred = makePrediction({ status: "refuelling-imminent", daysDifference: 1 });
        expect(getRefillDisplayString(pred, "fuel")).toContain("Tomorrow - refuelling due");
    });

    it("returns imminent date string when daysDifference > 1 but refuelling-imminent", () => {
        const pred = makePrediction({ status: "refuelling-imminent", daysDifference: -1 });
        const result = getRefillDisplayString(pred, "fuel");
        expect(result).toContain("refuelling imminent");
    });

    it("returns overdue with 'missed' for 1 cycle missed", () => {
        const pred = makePrediction({ status: "overdue", cyclesMissed: 1 });
        expect(getRefillDisplayString(pred, "fuel")).toContain("(missed)");
    });

    it("returns overdue with cycle count for multiple cycles missed", () => {
        const pred = makePrediction({ status: "overdue", cyclesMissed: 3 });
        expect(getRefillDisplayString(pred, "fuel")).toContain("(3 cycles missed)");
    });
});

describe("getStatusClassName", () => {
    it("returns emerald class for on-track", () => {
        expect(getStatusClassName("on-track")).toContain("emerald");
    });

    it("returns amber class for refuelling-soon", () => {
        expect(getStatusClassName("refuelling-soon")).toContain("amber");
    });

    it("returns orange class for refuelling-imminent", () => {
        expect(getStatusClassName("refuelling-imminent")).toContain("orange");
    });

    it("returns rose class for overdue", () => {
        expect(getStatusClassName("overdue")).toContain("rose");
    });

    it("returns slate class for insufficient-data", () => {
        expect(getStatusClassName("insufficient-data")).toContain("slate");
    });
});

describe("getStatusIcon", () => {
    it("returns CheckCircle for on-track", () => {
        expect(getStatusIcon("on-track")).toBe("CheckCircle");
    });

    it("returns Clock for refuelling-soon", () => {
        expect(getStatusIcon("refuelling-soon")).toBe("Clock");
    });

    it("returns AlertCircle for refuelling-imminent", () => {
        expect(getStatusIcon("refuelling-imminent")).toBe("AlertCircle");
    });

    it("returns AlertTriangle for overdue", () => {
        expect(getStatusIcon("overdue")).toBe("AlertTriangle");
    });

    it("returns HelpCircle for insufficient-data", () => {
        expect(getStatusIcon("insufficient-data")).toBe("HelpCircle");
    });
});
