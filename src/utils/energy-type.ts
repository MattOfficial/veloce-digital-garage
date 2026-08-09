import type { FuelLogEnergyType, Powertrain } from "@/types/database";

/**
 * Which log form a vehicle gets.
 *
 * This is derived from the powertrain on every read rather than held in state.
 * A modal that stored the answer at mount kept showing the charge form after
 * the owner switched from an EV to a petrol car, because a `useState`
 * initialiser only runs once and the component never unmounted. Deriving it
 * makes that class of bug unrepresentable: a petrol vehicle cannot render the
 * charge form whatever else is going on.
 */

/** Only a plug-in hybrid burns fuel *and* charges, so only it gets a choice. */
export function canChooseEnergyType(
    powertrain: Powertrain | null | undefined,
): boolean {
    return powertrain === "phev" || powertrain === "rex";
}

/**
 * `preferred` is honoured only where the owner is actually offered the choice.
 * Everywhere else the powertrain decides outright.
 */
export function resolveEnergyType(
    powertrain: Powertrain | null | undefined,
    preferred: FuelLogEnergyType = "fuel",
): FuelLogEnergyType {
    if (powertrain === "ev") return "charge";
    if (canChooseEnergyType(powertrain)) return preferred;

    return "fuel";
}
