import type {
    ChargeEnergyBasis,
    ChargePricingMode,
    FuelLog,
} from "@/types/database";

/**
 * What a charge session cost and how much energy it delivered.
 *
 * Cost is modelled as the four OCPI tariff dimensions — the format charging
 * networks already express their prices in to bill each other across borders.
 * Every pricing model in the wild decomposes into these four plus tax: tiering
 * by power is a different rate, time-of-use is a time-restricted rate, dynamic
 * pricing is a rate that moves, membership is a discount plus a subscription
 * that is not a session at all. See docs/ev-charging-redesign.md.
 *
 * The rate arithmetic here is a convenience calculator for the log form. The
 * stored `total_cost` is authoritative, which is what makes exotic tariffs
 * representable: whatever a network invents, the owner knows what they paid.
 */

/** Below this a SoC gauge reporting whole percent is mostly quantisation noise. */
const MIN_SOC_DELTA = 1;
/** A capacity measurement divides by the SoC added; a small top-up amplifies gauge error. */
const MIN_SOC_DELTA_FOR_CAPACITY = 50;
/** What counts as "full" given gauges that rarely settle on exactly 100. */
export const FULL_CHARGE_SOC = 98;

export interface ChargeCostComponents {
    /** ENERGY: kWh delivered x rate. */
    energy: number;
    /** TIME: minutes charging x rate. */
    time: number;
    /** PARKING_TIME: minutes plugged in after the session finished x rate. */
    idle: number;
    /** FLAT: a fixed fee for plugging in at all. */
    flat: number;
    tax: number;
    subtotal: number;
    total: number;
}

export interface ChargeSessionInput {
    pricingMode: ChargePricingMode;
    /** Metered kWh, when the charger or meter reported it. */
    energyKwh?: number | null;
    ratePerUnit?: number | null;
    durationMinutes?: number | null;
    sessionFee?: number | null;
    idleMinutes?: number | null;
    idleRatePerMinute?: number | null;
    taxPercent?: number | null;
    startSoc?: number | null;
    endSoc?: number | null;
    /** What the pack delivers between 100% and 0% indicated. */
    usableBatteryKwh?: number | null;
}

export interface ResolvedChargeEnergy {
    energyKwh: number | null;
    basis: ChargeEnergyBasis | null;
}

function positive(value: number | null | undefined): number | null {
    return value != null && Number.isFinite(value) && value > 0 ? value : null;
}

function nonNegative(value: number | null | undefined): number {
    return value != null && Number.isFinite(value) && value > 0 ? value : 0;
}

/** The SoC a session added, or null when either end is missing or it went backwards. */
export function getSocDelta(
    startSoc: number | null | undefined,
    endSoc: number | null | undefined,
): number | null {
    if (startSoc == null || endSoc == null) return null;
    if (!Number.isFinite(startSoc) || !Number.isFinite(endSoc)) return null;

    const delta = endSoc - startSoc;
    return delta >= MIN_SOC_DELTA ? delta : null;
}

/**
 * kWh for a session, preferring what was actually metered.
 *
 * A per-minute charger never reports energy, so the SoC delta and the pack size
 * are the only route to it — that is the whole reason the vehicle's battery size
 * is collected at setup.
 */
export function resolveSessionEnergy(input: ChargeSessionInput): ResolvedChargeEnergy {
    const metered = positive(input.energyKwh);
    if (metered != null) {
        return { energyKwh: metered, basis: "metered" };
    }

    const socDelta = getSocDelta(input.startSoc, input.endSoc);
    const usableKwh = positive(input.usableBatteryKwh);

    if (socDelta == null || usableKwh == null) {
        return { energyKwh: null, basis: null };
    }

    return { energyKwh: (socDelta / 100) * usableKwh, basis: "soc_derived" };
}

/**
 * Prices a session from its rate components. Only the dimension the pricing
 * mode selects is charged for; the extras (session fee, idle, tax) apply to
 * every mode because networks bolt them onto anything.
 */
export function calculateSessionCost(input: ChargeSessionInput): ChargeCostComponents {
    const rate = nonNegative(input.ratePerUnit);

    const energyKwh =
        input.pricingMode === "per_kwh" ? nonNegative(input.energyKwh) : 0;
    const energy = input.pricingMode === "per_kwh" ? energyKwh * rate : 0;

    const time =
        input.pricingMode === "per_minute"
            ? nonNegative(input.durationMinutes) * rate
            : 0;

    const idle = nonNegative(input.idleMinutes) * nonNegative(input.idleRatePerMinute);
    const flat = input.pricingMode === "free" ? 0 : nonNegative(input.sessionFee);

    const subtotal = energy + time + idle + flat;
    const tax = subtotal * (nonNegative(input.taxPercent) / 100);

    return { energy, time, idle, flat, tax, subtotal, total: subtotal + tax };
}

/**
 * Whether a session ended at a full charge. Used as the efficiency anchor when
 * the owner logged no percentages — without a SoC reference point, a full
 * battery is the only repeatable one, exactly as a full tank is for petrol.
 */
export function isFullChargeSession(log: {
    end_soc: number | null;
    charged_to_full: boolean | null;
}): boolean {
    if (log.end_soc != null) return log.end_soc >= FULL_CHARGE_SOC;
    return log.charged_to_full === true;
}

export interface PackCapacityMeasurement {
    logId: string;
    date: string;
    odometer: number;
    /** Upper bound: metered kWh includes charger losses that never reached the pack. */
    apparentUsableKwh: number;
    socDelta: number;
}

/**
 * The one thing a 100% charge is genuinely needed for.
 *
 * `energy / (socDelta / 100)` sizes the pack. Metered energy includes charging
 * losses — roughly 10-15% on AC, 5-10% on DC — so the figure over-reads and is
 * an upper bound rather than a capacity. The bias is broadly constant per
 * charger type though, so the trend across measurements is sound even where the
 * absolute value is soft, and that trend is state of health in kWh rather than
 * inferred from range.
 */
export function measurePackCapacity(log: FuelLog): PackCapacityMeasurement | null {
    if (log.energy_type !== "charge") return null;
    if (log.energy_basis !== "metered") return null;
    if (log.end_soc == null || log.end_soc < FULL_CHARGE_SOC) return null;

    const socDelta = getSocDelta(log.start_soc, log.end_soc);
    const energyKwh = positive(log.fuel_volume);

    if (socDelta == null || socDelta < MIN_SOC_DELTA_FOR_CAPACITY || energyKwh == null) {
        return null;
    }

    return {
        logId: log.id,
        date: log.date,
        odometer: log.odometer,
        apparentUsableKwh: energyKwh / (socDelta / 100),
        socDelta,
    };
}

/**
 * Charger and onboard-rectifier losses, as a fraction of metered energy that
 * never reaches the pack. Needs both a metered figure and a SoC delta on the
 * same session, so it is only available when the owner logged both.
 */
export function estimateChargingLoss(
    log: FuelLog,
    usableBatteryKwh: number | null,
): number | null {
    if (log.energy_basis !== "metered") return null;

    const metered = positive(log.fuel_volume);
    const socDelta = getSocDelta(log.start_soc, log.end_soc);
    const usableKwh = positive(usableBatteryKwh);

    if (metered == null || socDelta == null || usableKwh == null) return null;

    const intoPack = (socDelta / 100) * usableKwh;
    if (intoPack <= 0 || intoPack > metered) return null;

    return (metered - intoPack) / metered;
}
