import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
    it("returns a single class name unchanged", () => {
        expect(cn("foo")).toBe("foo");
    });

    it("merges multiple class names", () => {
        expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional class names (falsy values omitted)", () => {
        expect(cn("foo", false && "bar", undefined, null, "baz")).toBe("foo baz");
    });

    it("resolves Tailwind conflicts by keeping the last value", () => {
        expect(cn("p-2", "p-4")).toBe("p-4");
        expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("returns empty string with no arguments", () => {
        expect(cn()).toBe("");
    });

    it("handles array-style clsx input", () => {
        expect(cn(["foo", "bar"])).toBe("foo bar");
    });

    it("handles object-style clsx input", () => {
        expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });
});
