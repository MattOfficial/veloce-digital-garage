import type { FuelType, Powertrain } from '@/types/database';

export type EnergyTheme = 'petrol' | 'diesel' | 'hybrid' | 'ev' | 'ice';

interface EnergyVehicleInput {
  powertrain?: Powertrain | null;
  fuel_type?: FuelType | null;
}

/**
 * Resolves the visual energy theme for a vehicle based on its powertrain and fuel type.
 *
 * Rules:
 * - 'ev' -> pure electric nature theme
 * - 'hev', 'phev', 'rex' -> dual-propulsion hybrid theme
 * - 'petrol' fuel -> high-revving combustion redline theme
 * - 'diesel' fuel -> industrial high-torque amber theme
 * - Fallback -> neutral combustion theme
 */
export function getEnergyTheme(vehicle?: EnergyVehicleInput | null): EnergyTheme {
  if (!vehicle) return 'ice';
  const { powertrain, fuel_type } = vehicle;

  if (powertrain === 'ev') return 'ev';
  if (powertrain === 'hev' || powertrain === 'phev' || powertrain === 'rex') {
    return 'hybrid';
  }

  if (fuel_type === 'petrol') return 'petrol';
  if (fuel_type === 'diesel') return 'diesel';

  return 'ice';
}
