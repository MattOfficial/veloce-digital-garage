import { ui } from "@/content/en/ui";
import type { FuelType, Powertrain } from "@/types/database";

/**
 * How a vehicle's energy is described, in one place.
 *
 * The garage card badged electric and hybrid vehicles and left a petrol car
 * with nothing, while the report called every combustion vehicle
 * "Petrol / Diesel" — a distinction the app could not actually make until
 * `fuel_type` existed. Both now read from here, so they cannot drift apart.
 */

export type VehicleEnergyKind = "ev" | "hybrid" | FuelType | "combustion";

export type VehicleEnergySummary = {
  kind: VehicleEnergyKind;
  /** Short form for a badge: "EV", "PHEV", "Petrol". */
  label: string;
  /** Long form for a report: "Plug-in hybrid", "Petrol". */
  description: string;
};

type EnergyVehicle = {
  powertrain: Powertrain;
  fuel_type: FuelType | null;
};

const HYBRID_POWERTRAINS: Powertrain[] = ["hev", "phev", "rex"];

export function getVehicleEnergySummary(vehicle: EnergyVehicle): VehicleEnergySummary {
  const { powertrain, fuel_type } = vehicle;
  const fuelLabel = fuel_type != null ? ui.profile.fuelTypeOptions[fuel_type] : null;

  if (powertrain === "ev") {
    return { kind: "ev", label: "EV", description: ui.reports.powertrain.ev };
  }

  if (HYBRID_POWERTRAINS.includes(powertrain)) {
    return {
      kind: "hybrid",
      label: powertrain.toUpperCase(),
      // A hybrid burns something too, so name it when the owner has said what.
      description:
        fuelLabel != null
          ? `${ui.reports.powertrain[powertrain]} · ${fuelLabel}`
          : ui.reports.powertrain[powertrain],
    };
  }

  // Unanswered is not petrol. Falling back to the wording the setup form uses
  // beats inventing a fuel the owner never chose.
  if (fuel_type == null || fuelLabel == null) {
    return {
      kind: "combustion",
      label: "ICE",
      description: ui.reports.powertrain.ice,
    };
  }

  return { kind: fuel_type, label: fuelLabel, description: fuelLabel };
}
