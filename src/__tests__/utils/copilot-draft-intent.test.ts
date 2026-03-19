import { describe, it, expect } from "vitest";
import { detectExplicitDraftIntent } from "@/utils/copilot-draft-intent";

describe("detectExplicitDraftIntent", () => {
    // ── Returns null ─────────────────────────────────────────────────────────
    it("returns null for empty string", () => {
        expect(detectExplicitDraftIntent("")).toBeNull();
    });

    it("returns null for whitespace only", () => {
        expect(detectExplicitDraftIntent("   ")).toBeNull();
    });

    it("returns null when message is a question (starts with question word)", () => {
        expect(detectExplicitDraftIntent("What fuel did I use?")).toBeNull();
    });

    it("returns null for a message ending with '?'", () => {
        expect(detectExplicitDraftIntent("How much petrol did I use?")).toBeNull();
    });

    it("returns null for analytical chat with no log command", () => {
        expect(detectExplicitDraftIntent("Show me my total fuel spend")).toBeNull();
    });

    // ── Fuel log via direct command ───────────────────────────────────────────
    it("detects 'log fuel' direct command", () => {
        expect(detectExplicitDraftIntent("log fuel")).toBe("log_fuel_draft");
    });

    it("detects 'add a fuel entry' command", () => {
        expect(detectExplicitDraftIntent("add a fuel entry")).toBe("log_fuel_draft");
    });

    it("detects 'record petrol fill' command", () => {
        expect(detectExplicitDraftIntent("record petrol fill")).toBe("log_fuel_draft");
    });

    it("detects 'save gas fill up' command", () => {
        expect(detectExplicitDraftIntent("save gas fill up")).toBe("log_fuel_draft");
    });

    it("detects 'track kwh charge' command", () => {
        expect(detectExplicitDraftIntent("track kwh charge")).toBe("log_fuel_draft");
    });

    it("detects request-form 'can you log my fuel fill'", () => {
        expect(detectExplicitDraftIntent("can you log my fuel fill")).toBe("log_fuel_draft");
    });

    it("detects 'please log fuel fill' with prefix", () => {
        expect(detectExplicitDraftIntent("please log fuel fill")).toBe("log_fuel_draft");
    });

    // ── Maintenance log via direct command ────────────────────────────────────
    it("detects 'log maintenance' direct command", () => {
        expect(detectExplicitDraftIntent("log maintenance")).toBe("log_maintenance_draft");
    });

    it("detects 'add oil change' command", () => {
        expect(detectExplicitDraftIntent("add oil change")).toBe("log_maintenance_draft");
    });

    it("detects 'record service' command", () => {
        expect(detectExplicitDraftIntent("record service")).toBe("log_maintenance_draft");
    });

    it("detects 'save brake repair' command", () => {
        expect(detectExplicitDraftIntent("save brake repair")).toBe("log_maintenance_draft");
    });

    it("detects 'track tyre replacement' command", () => {
        expect(detectExplicitDraftIntent("track tyre replacement")).toBe("log_maintenance_draft");
    });

    it("detects request-form 'can you record maintenance'", () => {
        expect(detectExplicitDraftIntent("can you record maintenance")).toBe("log_maintenance_draft");
    });

    // ── Heuristic path: first-person + exact action phrases ──────────────────
    // Only include cases where both keyword AND action pattern have exact word-boundary matches.
    it("detects fuel from 'I got petrol today' (keyword: petrol, action: got petrol)", () => {
        expect(detectExplicitDraftIntent("I got petrol today")).toBe("log_fuel_draft");
    });

    it("detects fuel from 'I got gas this morning' (keyword: gas, action: got gas)", () => {
        expect(detectExplicitDraftIntent("I got gas this morning")).toBe("log_fuel_draft");
    });

    it("detects maintenance from 'I just replaced my tyre today' (keyword: tyre, action: replaced)", () => {
        expect(detectExplicitDraftIntent("I just replaced my tyre today")).toBe("log_maintenance_draft");
    });

    // ── Ambiguity: fuel wins ──────────────────────────────────────────────────
    it("returns fuel draft when both fuel and maintenance direct-command keywords co-occur", () => {
        expect(detectExplicitDraftIntent("log fuel and oil change")).toBe("log_fuel_draft");
    });
});
