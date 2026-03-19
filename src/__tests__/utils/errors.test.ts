import { describe, it, expect } from "vitest";
import { getErrorMessage } from "@/utils/errors";

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
