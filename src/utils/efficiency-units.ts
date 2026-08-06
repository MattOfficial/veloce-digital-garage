export const FUEL_EFFICIENCY_UNITS = [
  "km/L",
  "L/100km",
  "MPG (US)",
  "MPG (UK)",
] as const;

export type FuelEfficiencyUnit = (typeof FUEL_EFFICIENCY_UNITS)[number];
export type FuelVolumeUnit = "Liters" | "Gallons" | "Gallons (UK)";

export const EV_EFFICIENCY_UNITS = [
  "Wh/km",
  "km/kWh",
  "mi/kWh",
  "kWh/100km",
] as const;

export type EvEfficiencyUnit = (typeof EV_EFFICIENCY_UNITS)[number];

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

export function isEvEfficiencyUnit(value: string): value is EvEfficiencyUnit {
  return EV_EFFICIENCY_UNITS.some((unit) => unit === value);
}

export function getDefaultEvEfficiencyUnit(
  distanceUnit: DistanceUnit,
): EvEfficiencyUnit {
  return distanceUnit === "miles" ? "mi/kWh" : "Wh/km";
}

/**
 * Consumption units (Wh/km, kWh/100km) improve as they fall, economy units
 * (km/kWh, mi/kWh) improve as they rise. Trend arrows and "better than last
 * month" comparisons need to know which way is good.
 */
export function isLowerBetterEvUnit(unit: EvEfficiencyUnit): boolean {
  return unit === "Wh/km" || unit === "kWh/100km";
}

/**
 * Wh/km reads best as a whole number, the economy units need a decimal to be
 * useful at all (4.2 km/kWh vs 4 km/kWh is a 5% difference).
 */
export function getEvEfficiencyPrecision(unit: EvEfficiencyUnit): number {
  return unit === "Wh/km" ? 0 : 1;
}

/**
 * Converts a distance and consumed energy from the user's storage units into a
 * requested display metric. Invalid or incomplete segments have no efficiency.
 */
export function convertEvEfficiency(
  distance: number,
  energyKwh: number,
  targetUnit: EvEfficiencyUnit,
  distanceUnit: DistanceUnit,
): number | null {
  if (
    !Number.isFinite(distance) ||
    !Number.isFinite(energyKwh) ||
    distance <= 0 ||
    energyKwh <= 0
  ) {
    return null;
  }

  const distanceKm = distanceUnit === "miles" ? distance * KM_PER_MILE : distance;

  switch (targetUnit) {
    case "Wh/km":
      return (energyKwh * 1000) / distanceKm;
    case "km/kWh":
      return distanceKm / energyKwh;
    case "mi/kWh":
      return distanceKm / KM_PER_MILE / energyKwh;
    case "kWh/100km":
      return (energyKwh / distanceKm) * 100;
  }
}
