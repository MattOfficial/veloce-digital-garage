import type { VehicleWithLogs } from "@/types/database";
import {
    convertEvEfficiency,
    getEvEfficiencyPrecision,
    type EvEfficiencyUnit,
} from "@/utils/efficiency-units";
import {
    summarizeChargeEfficiency,
    type ChargeSegmentMethod,
} from "@/utils/ev-energy-analytics";
import { getVehicleLifetimeDistanceSummary } from "@/utils/distance-analytics";

/**
 * The single derivation behind every "how far does a unit take me" figure.
 *
 * The dashboard used to read this off battery health, which is measured from
 * state-of-charge check-ins, while the Energy & Battery page read it off charge
 * sessions. An owner who logs charges but never records a check-in therefore saw
 * a number on one page and a blank on the other. Both now call this.
 */

type DistanceUnit = "km" | "miles";

/** What the number was measured from, for the sub-label under it. */
export type EvEfficiencyBasis =
    | "lifetime"
    | "mixed-segments"
    | ChargeSegmentMethod;

export interface EvEfficiencyDisplay {
    /** In `unit`, ready to render. Null when nothing can be measured yet. */
    value: number | null;
    /** Decimal places `unit` should be rendered with. */
    precision: number;
    unit: EvEfficiencyUnit;
    basis: EvEfficiencyBasis | null;
    /** Charges with nothing to anchor them, worth prompting the owner about. */
    unanchoredSessionCount: number;
}

export function getEvEfficiencyDisplay(
    vehicle: VehicleWithLogs,
    options: { unit: EvEfficiencyUnit; distanceUnit: DistanceUnit },
): EvEfficiencyDisplay {
    const { unit, distanceUnit } = options;

    const efficiency = summarizeChargeEfficiency(vehicle.fuel_logs ?? [], {
        lifetimeDistance: getVehicleLifetimeDistanceSummary(vehicle).value,
    });

    // `distancePerKwh` is already in the owner's distance unit, so the
    // conversion is one unit of energy against that distance.
    const value =
        efficiency.distancePerKwh != null
            ? convertEvEfficiency(efficiency.distancePerKwh, 1, unit, distanceUnit)
            : null;

    return {
        value,
        precision: getEvEfficiencyPrecision(unit),
        unit,
        basis: resolveBasis(efficiency.basis, efficiency.method),
        unanchoredSessionCount: efficiency.unanchoredSessionCount,
    };
}

function resolveBasis(
    basis: "segments" | "lifetime" | "none",
    method: ChargeSegmentMethod | null,
): EvEfficiencyBasis | null {
    if (basis === "lifetime") return "lifetime";
    // Segments with no single method came from a mix of the two.
    if (basis === "segments") return method ?? "mixed-segments";

    return null;
}
