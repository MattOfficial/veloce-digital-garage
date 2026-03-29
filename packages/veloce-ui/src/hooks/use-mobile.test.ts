import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile hook", () => {
  beforeEach(() => {
    // Reset to default non-mobile viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("returns false for desktop viewport", () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());
    // Initial state is undefined, after effect it should be false
    act(() => {});
    expect(result.current).toBe(false);
  });

  it("returns true for mobile viewport", () => {
    window.innerWidth = 375;
    const { result } = renderHook(() => useIsMobile());
    act(() => {});
    expect(result.current).toBe(true);
  });

  it("returns true for tablet viewport (below breakpoint)", () => {
    window.innerWidth = 768;
    const { result } = renderHook(() => useIsMobile());
    act(() => {});
    expect(result.current).toBe(false);
  });

  it("returns true for small tablet viewport", () => {
    window.innerWidth = 767;
    const { result } = renderHook(() => useIsMobile());
    act(() => {});
    expect(result.current).toBe(true);
  });
});
