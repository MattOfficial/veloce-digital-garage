export const FUEL_EFFICIENCY_UNITS = [
  "km/L",
  "L/100km",
  "MPG (US)",
  "MPG (UK)",
] as const;

export type FuelEfficiencyUnit = (typeof FUEL_EFFICIENCY_UNITS)[number];
export type FuelVolumeUnit = "Liters" | "Gallons" | "Gallons (UK)";

type DistanceUnit = "km" | "miles";

const KM_PER_MILE = 1.609344;
const LITERS_PER_US_GALLON = 3.785411784;
const LITERS_PER_UK_GALLON = 4.54609;

export function isFuelEfficiencyUnit(
  value: string,
): value is FuelEfficiencyUnit {
  return FUEL_EFFICIENCY_UNITS.some((unit) => unit === value);
}

export function getDefaultFuelEfficiencyUnit(
  distanceUnit: DistanceUnit,
  volumeUnit: FuelVolumeUnit,
): FuelEfficiencyUnit {
  if (distanceUnit === "km") {
    return "km/L";
  }

  return volumeUnit === "Gallons (UK)" ? "MPG (UK)" : "MPG (US)";
}

/**
 * Converts a distance and consumed volume from the user's storage units into a
 * requested display metric. Invalid or incomplete segments have no efficiency.
 */
export function convertFuelEfficiency(
  distance: number,
  volume: number,
  targetUnit: FuelEfficiencyUnit,
  distanceUnit: DistanceUnit,
  volumeUnit: FuelVolumeUnit,
): number | null {
  if (
    !Number.isFinite(distance) ||
    !Number.isFinite(volume) ||
    distance <= 0 ||
    volume <= 0
  ) {
    return null;
  }

  const distanceKm = distanceUnit === "miles" ? distance * KM_PER_MILE : distance;
  const volumeLiters =
    volumeUnit === "Gallons"
      ? volume * LITERS_PER_US_GALLON
      : volumeUnit === "Gallons (UK)"
        ? volume * LITERS_PER_UK_GALLON
        : volume;

  const kmPerLiter = distanceKm / volumeLiters;

  switch (targetUnit) {
    case "km/L":
      return kmPerLiter;
    case "L/100km":
      return 100 / kmPerLiter;
    case "MPG (US)":
      return (distanceKm / KM_PER_MILE) / (volumeLiters / LITERS_PER_US_GALLON);
    case "MPG (UK)":
      return (distanceKm / KM_PER_MILE) / (volumeLiters / LITERS_PER_UK_GALLON);
  }
}
