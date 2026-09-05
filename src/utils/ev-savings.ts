import type { VehicleType, VehicleWithLogs } from "@/types/database";
import { isLiquidFuelPowertrain } from "@/types/database";
import { getVehicleLifetimeDistanceSummary } from "@/utils/distance-analytics";
import { buildFuelAnalytics } from "@/utils/fuel-analytics";
import { getOwnershipCostSummary } from "@/utils/ownership-analytics";

/**
 * What an EV saves against petrol.
 *
 * The comparison an owner actually believes is the one against a vehicle they
 * own: their own riding, their own fuel prices, their own traffic. So the
 * benchmark is measured from the garage first, matched like for like — a
 * scooter against their other scooters, a car against their other cars — and
 * only falls back to a published average when there is nothing to compare with.
 *
 * Every figure reports its `source`, because "you save X" from a real vehicle
 * and "you save X" from a national average are different claims.
 */

/**
 * Fuel-only running cost, in rupees per kilometre, for a vehicle bought and run
 * in India. Derived rather than quoted so they can be re-checked:
 *
 *   two-wheeler: 45 km/L at ~Rs 101/L  =>  Rs 2.24/km
 *   car:         13 km/L at ~Rs 104/L  =>  Rs 8.00/km
 *
 * Published ranges in 2026 put scooters at Rs 2.00-2.80/km and petrol cars at
 * Rs 7-10/km, so both sit mid-band. Excludes maintenance and insurance, which
 * matches what the EV side of the comparison measures.
 */
export const REGIONAL_PETROL_COST_PER_KM: Record<VehicleType, number> = {
    motorcycle: 2.25,
    car: 8,
    // No separate figure researched; a light truck is worse than a car, so this
    // understates the saving rather than inflating it.
    truck: 8,
};

/** The defaults above are rupee figures, so they only apply to a rupee garage. */
const REGIONAL_DEFAULT_CURRENCIES = new Set(["INR", "₹", "RS", "RS."]);

export type PetrolBenchmarkSource =
    | "garage"
    | "profile-reference"
    | "regional-default"
    | "unavailable";

export interface PetrolBenchmark {
    costPerDistance: number | null;
    source: PetrolBenchmarkSource;
    /** Garage source only: how many of the owner's vehicles fed the figure. */
    vehicleCount: number;
    /** Garage source only: distance those vehicles covered. */
    distance: number;
    vehicleType: VehicleType;
}

export interface EvSavings {
    distance: number | null;
    evCostPerDistance: number | null;
    petrolCostPerDistance: number | null;
    equivalentPetrolCost: number | null;
    savings: number | null;
    savingsPerDistance: number | null;
    benchmark: PetrolBenchmark;
}

/**
 * `fuel-only` isolates the energy-source saving — what petrol would have cost
 * for the same driving, nothing else. `all-in` nets out each vehicle's whole
 * tracked cost (fuel/charge, maintenance, everything), matching the headline
 * cost-per-distance already shown on that vehicle's own dashboard card, at
 * the cost of mixing "cheaper energy" with "cheaper (or costlier) upkeep" —
 * and of favouring a young EV that has not paid for its first service yet.
 */
export type SavingsCostBasis = "fuel-only" | "all-in";

export interface SavingsOptions {
    /** Rate and economy the owner set by hand, used when the garage cannot answer. */
    petrolPricePerUnit?: number | null;
    iceReferenceEfficiency?: number | null;
    /** Gates the rupee defaults. */
    currency?: string | null;
    /** Defaults to `fuel-only`, the original comparison. */
    costBasis?: SavingsCostBasis;
}

/**
 * A vehicle's cost and distance under the given basis. `all-in` reads the same
 * summary the dashboard's own running-cost card shows; `fuel-only` keeps
 * reading closed tank segments so a petrol peer's maintenance never leaks in.
 */
function getVehicleCostPerDistance(
    vehicle: VehicleWithLogs,
    basis: SavingsCostBasis,
): { distance: number; cost: number } | null {
    if (basis === "all-in") {
        const summary = getOwnershipCostSummary(vehicle);
        return summary.trackedDistance > 0 && summary.totalCost > 0
            ? { distance: summary.trackedDistance, cost: summary.totalCost }
            : null;
    }

    return getVehicleFuelCostPerDistance(vehicle);
}

function isRupeeGarage(currency: string | null | undefined): boolean {
    const normalized = currency?.trim().toUpperCase();
    return normalized != null && REGIONAL_DEFAULT_CURRENCIES.has(normalized);
}

/**
 * Cost per distance for one liquid-fuel vehicle, from its closed tank segments.
 * Segments are used rather than raw log totals because an open segment's fuel
 * has been paid for but not yet driven, which would inflate the rate.
 */
export function getVehicleFuelCostPerDistance(
    vehicle: VehicleWithLogs,
): { distance: number; cost: number } | null {
    const analytics = buildFuelAnalytics(
        vehicle.fuel_logs ?? [],
        vehicle.baseline_odometer ?? 0,
    );

    const segments = analytics.fuel.closed_segments;
    if (segments.length === 0) return null;

    const distance = segments.reduce((total, segment) => total + segment.distance, 0);
    const cost = segments.reduce((total, segment) => total + segment.cost, 0);

    return distance > 0 && cost > 0 ? { distance, cost } : null;
}

/**
 * The petrol rate to judge an EV against.
 *
 * Matching is on `vehicle_type`, so a two-wheeler is never compared with a car.
 * Across several matching vehicles the totals are pooled rather than averaged,
 * which weights by distance — a car driven 20,000 km should count for more than
 * one driven 500.
 */
export function getPetrolBenchmark(
    evVehicle: Pick<VehicleWithLogs, "id" | "vehicle_type">,
    garage: VehicleWithLogs[],
    options: SavingsOptions = {},
): PetrolBenchmark {
    const vehicleType = evVehicle.vehicle_type;
    const basis = options.costBasis ?? "fuel-only";

    const peers = garage.filter(
        (vehicle) =>
            vehicle.id !== evVehicle.id &&
            vehicle.vehicle_type === vehicleType &&
            isLiquidFuelPowertrain(vehicle.powertrain),
    );

    let pooledDistance = 0;
    let pooledCost = 0;
    let contributing = 0;

    for (const peer of peers) {
        const measured = getVehicleCostPerDistance(peer, basis);
        if (!measured) continue;

        pooledDistance += measured.distance;
        pooledCost += measured.cost;
        contributing += 1;
    }

    if (contributing > 0 && pooledDistance > 0) {
        return {
            costPerDistance: pooledCost / pooledDistance,
            source: "garage",
            vehicleCount: contributing,
            distance: pooledDistance,
            vehicleType,
        };
    }

    // The fuel-price and regional fallbacks describe the energy cost alone —
    // there is no honest all-in equivalent to reach for, since maintenance
    // histories vary far more than fuel prices do. All-in stops at a real
    // garage peer or reports nothing.
    if (basis === "all-in") {
        return {
            costPerDistance: null,
            source: "unavailable",
            vehicleCount: 0,
            distance: 0,
            vehicleType,
        };
    }

    const { petrolPricePerUnit = null, iceReferenceEfficiency = null } = options;
    if (
        petrolPricePerUnit != null &&
        petrolPricePerUnit > 0 &&
        iceReferenceEfficiency != null &&
        iceReferenceEfficiency > 0
    ) {
        return {
            costPerDistance: petrolPricePerUnit / iceReferenceEfficiency,
            source: "profile-reference",
            vehicleCount: 0,
            distance: 0,
            vehicleType,
        };
    }

    if (isRupeeGarage(options.currency)) {
        return {
            costPerDistance: REGIONAL_PETROL_COST_PER_KM[vehicleType],
            source: "regional-default",
            vehicleCount: 0,
            distance: 0,
            vehicleType,
        };
    }

    return {
        costPerDistance: null,
        source: "unavailable",
        vehicleCount: 0,
        distance: 0,
        vehicleType,
    };
}

/**
 * Lifetime saving for an EV against the best benchmark available.
 *
 * Lifetime rather than a rolling window: the number an owner wants is "what has
 * this thing saved me", and a 30-day figure understates it to the point of
 * being discouraging early on.
 */
export function buildEvSavings(
    evVehicle: VehicleWithLogs,
    garage: VehicleWithLogs[],
    options: SavingsOptions = {},
): EvSavings {
    const basis = options.costBasis ?? "fuel-only";
    const benchmark = getPetrolBenchmark(evVehicle, garage, options);

    // All-in reads the same summary the dashboard's own running-cost card
    // shows, so the two numbers agree; fuel-only isolates the charge cost so
    // this vehicle's own maintenance cannot flatter or worsen the comparison.
    let distance: number | null;
    let evCost: number;

    if (basis === "all-in") {
        const summary = getOwnershipCostSummary(evVehicle);
        distance = summary.trackedDistance > 0 ? summary.trackedDistance : null;
        evCost = summary.totalCost;
    } else {
        distance = getVehicleLifetimeDistanceSummary(evVehicle).value;
        evCost = (evVehicle.fuel_logs ?? [])
            .filter((log) => log.energy_type === "charge")
            .reduce(
                (total, log) => total + (Number.isFinite(log.total_cost) ? log.total_cost : 0),
                0,
            );
    }

    const evCostPerDistance =
        distance != null && distance > 0 && evCost > 0 ? evCost / distance : null;

    if (
        distance == null ||
        distance <= 0 ||
        evCostPerDistance == null ||
        benchmark.costPerDistance == null
    ) {
        return {
            distance,
            evCostPerDistance,
            petrolCostPerDistance: benchmark.costPerDistance,
            equivalentPetrolCost: null,
            savings: null,
            savingsPerDistance: null,
            benchmark,
        };
    }

    const equivalentPetrolCost = distance * benchmark.costPerDistance;
    const savings = equivalentPetrolCost - evCost;

    return {
        distance,
        evCostPerDistance,
        petrolCostPerDistance: benchmark.costPerDistance,
        equivalentPetrolCost,
        savings,
        savingsPerDistance: savings / distance,
        benchmark,
    };
}
