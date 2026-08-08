import { describe, it, expect } from "vitest";
import { getDatabaseErrorMessage, getErrorMessage } from "@/utils/errors";

describe("getDatabaseErrorMessage", () => {
    it("names a pending migration when PostgREST cannot find the column", () => {
        // The exact shape that made a missing migration look like an app bug.
        const message = getDatabaseErrorMessage(
            {
                code: "PGRST204",
                message:
                    "Could not find the 'charged_to_full' column of 'fuel_logs' in the schema cache",
            },
            "Failed to save fuel log",
        );

        expect(message).toContain("charged_to_full");
        expect(message).toContain("supabase db push");
    });

    it("treats the Postgres undefined-column code the same way", () => {
        const message = getDatabaseErrorMessage(
            { code: "42703", message: "column fuel_logs.pricing_mode does not exist" },
            "Failed to save fuel log",
        );

        expect(message).toContain("supabase db push");
    });

    it("appends the database message to the fallback for anything else", () => {
        expect(
            getDatabaseErrorMessage(
                { code: "23514", message: "violates check constraint" },
                "Failed to save fuel log",
            ),
        ).toBe("Failed to save fuel log: violates check constraint");
    });

    it("uses the fallback alone when the error carries no message", () => {
        expect(getDatabaseErrorMessage({ code: "23514" }, "Failed to save")).toBe(
            "Failed to save",
        );
        expect(getDatabaseErrorMessage(null, "Failed to save")).toBe("Failed to save");
    });
});

describe("getErrorMessage", () => {
    it("returns the message from an Error instance", () => {
        const error = new Error("something went wrong");
        expect(getErrorMessage(error, "fallback")).toBe("something went wrong");
    });

    it("returns the message from a plain object with a message property", () => {
        const error = { message: "object error" };
        expect(getErrorMessage(error, "fallback")).toBe("object error");
    });

    it("returns the fallback for a string error", () => {
        expect(getErrorMessage("oops", "fallback")).toBe("fallback");
    });

    it("returns the fallback for a number error", () => {
        expect(getErrorMessage(42, "fallback")).toBe("fallback");
    });

    it("returns the fallback for null", () => {
        expect(getErrorMessage(null, "fallback")).toBe("fallback");
    });

    it("returns the fallback for undefined", () => {
        expect(getErrorMessage(undefined, "fallback")).toBe("fallback");
    });

    it("returns the fallback when object has a non-string message", () => {
        const error = { message: 123 };
        expect(getErrorMessage(error, "fallback")).toBe("fallback");
    });

    it("returns the fallback for empty object", () => {
        expect(getErrorMessage({}, "fallback")).toBe("fallback");
    });
});
