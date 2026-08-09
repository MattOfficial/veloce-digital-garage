import { describe, expect, it } from "vitest";

import { canChooseEnergyType, resolveEnergyType } from "@/utils/energy-type";

describe("canChooseEnergyType", () => {
  it("offers the choice only to plug-in hybrids", () => {
    expect(canChooseEnergyType("phev")).toBe(true);
    expect(canChooseEnergyType("rex")).toBe(true);
  });

  it("withholds it from everything with a single energy source", () => {
    expect(canChooseEnergyType("ice")).toBe(false);
    expect(canChooseEnergyType("hev")).toBe(false);
    expect(canChooseEnergyType("ev")).toBe(false);
    expect(canChooseEnergyType(null)).toBe(false);
  });
});

describe("resolveEnergyType", () => {
  it("gives an EV the charge form", () => {
    expect(resolveEnergyType("ev")).toBe("charge");
  });

  it("gives liquid-fuel vehicles the fuel form", () => {
    expect(resolveEnergyType("ice")).toBe("fuel");
    expect(resolveEnergyType("hev")).toBe("fuel");
  });

  it("honours the preference only for a plug-in hybrid", () => {
    expect(resolveEnergyType("phev", "charge")).toBe("charge");
    expect(resolveEnergyType("phev", "fuel")).toBe("fuel");
    expect(resolveEnergyType("rex", "charge")).toBe("charge");
  });

  it("never lets a stale preference reach a vehicle that has no choice", () => {
    // The regression: switching from an EV to a petrol car left "charge"
    // behind in state, and the petrol car rendered the charge form.
    expect(resolveEnergyType("ice", "charge")).toBe("fuel");
    expect(resolveEnergyType("hev", "charge")).toBe("fuel");
  });

  it("never lets a stale preference override an EV either", () => {
    expect(resolveEnergyType("ev", "fuel")).toBe("charge");
  });

  it("defaults to fuel for an unknown powertrain", () => {
    expect(resolveEnergyType(null)).toBe("fuel");
    expect(resolveEnergyType(undefined)).toBe("fuel");
  });
});
