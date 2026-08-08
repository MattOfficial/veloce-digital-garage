/**
 * Coercion at the form boundary.
 *
 * An `<input type="number">` registered with react-hook-form holds a *string*.
 * `useWatch` hands that string straight back, so any live preview built on it is
 * reading `"2.6"` where the analytics expect `2.6`. `Number.isFinite` does not
 * coerce, so those values silently read as absent rather than throwing — which
 * is exactly the failure mode you never notice until a field stops working.
 *
 * Everything a form watches goes through here before reaching a calculation.
 */

/** A number, or undefined for blank, non-numeric and non-finite input. */
export function toOptionalNumber(value: unknown): number | undefined {
    if (value == null || value === "") return undefined;
    if (typeof value === "boolean") return undefined;

    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Coerces the named keys of a watched form object, leaving the rest alone.
 * Returns a new object; the input is untouched.
 */
export function toNumericFields<T extends object, K extends keyof T>(
    values: T,
    keys: readonly K[],
): T & { [P in K]: number | undefined } {
    const coerced = { ...values } as T & { [P in K]: number | undefined };

    for (const key of keys) {
        coerced[key] = toOptionalNumber(values[key]) as (T & {
            [P in K]: number | undefined;
        })[K];
    }

    return coerced;
}
