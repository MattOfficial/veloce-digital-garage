import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names", () => {
    const result = cn("foo", "bar");
    expect(result).toBe("foo bar");
  });

  it("should handle conditional class names", () => {
    const result = cn("foo", false && "bar", "baz");
    expect(result).toBe("foo baz");
  });

  it("should handle empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle arrays", () => {
    const result = cn(["foo", "bar"]);
    expect(result).toBe("foo bar");
  });

  it("should handle mixed inputs", () => {
    const result = cn("foo", ["bar", "baz"], "qux");
    expect(result).toBe("foo bar baz qux");
  });

  it("should handle objects with boolean values", () => {
    const result = cn("foo", { bar: true, baz: false });
    expect(result).toBe("foo bar");
  });

  it("should handle class-variance-authority ClassValue input", () => {
    // clsx returns a string which cn should handle
    const result = cn("btn", "btn-primary");
    expect(result).toBe("btn btn-primary");
  });
});
