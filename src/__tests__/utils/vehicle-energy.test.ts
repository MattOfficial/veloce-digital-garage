import { describe, expect, it } from "vitest";

import type { FuelType, Powertrain } from "@/types/database";
import { getVehicleEnergySummary } from "@/utils/vehicle-energy";

function summarize(powertrain: Powertrain, fuel_type: FuelType | null = null) {
  return getVehicleEnergySummary({ powertrain, fuel_type });
}

describe("getVehicleEnergySummary", () => {
  it("names the fuel a combustion vehicle actually burns", () => {
    expect(summarize("ice", "diesel")).toEqual({
      kind: "diesel",
      label: "Diesel",
      description: "Diesel",
    });
    expect(summarize("ice", "petrol").label).toBe("Petrol");
    expect(summarize("ice", "cng").label).toBe("CNG");
    expect(summarize("ice", "lpg").label).toBe("LPG");
  });

  it("does not guess petrol when the owner has not said", () => {
    // The old report asserted "Petrol / Diesel", a distinction nothing recorded.
    const summary = summarize("ice", null);

    expect(summary.kind).toBe("combustion");
    expect(summary.description).toBe("Petrol / Diesel");
    expect(summary.description).not.toBe("Petrol");
  });

  it("keeps electric its own kind, with no fuel", () => {
    expect(summarize("ev")).toEqual({
      kind: "ev",
      label: "EV",
      description: "Electric",
    });
  });

  it("badges every hybrid as a hybrid", () => {
    expect(summarize("hev").kind).toBe("hybrid");
    expect(summarize("phev").kind).toBe("hybrid");
    expect(summarize("rex").kind).toBe("hybrid");
    expect(summarize("phev").label).toBe("PHEV");
  });

  it("names a hybrid's fuel too, since it burns something", () => {
    expect(summarize("phev", "petrol").description).toBe("Plug-in hybrid · Petrol");
    expect(summarize("phev", null).description).toBe("Plug-in hybrid");
  });

  it("gives each kind a distinct badge, which is what the garage colours by", () => {
    const kinds = [
      summarize("ev").kind,
      summarize("hev").kind,
      summarize("ice", "petrol").kind,
      summarize("ice", "diesel").kind,
      summarize("ice", "cng").kind,
      summarize("ice", "lpg").kind,
      summarize("ice", null).kind,
    ];

    expect(new Set(kinds).size).toBe(kinds.length);
  });
});
