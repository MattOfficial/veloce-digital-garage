# Changelog

All notable changes to Veloce Digital Garage, newest first. One entry per commit.

Started 2026-08-08. Nothing before that date is recorded here — see the git history instead.

## Unreleased

### Audit — one write path for vehicle mutations (2026-08-08)

- New `useVehicleMutation` hook owns the sequence every form was open-coding: call the server
  action, read `success`, refresh the Zustand store *and* the router cache, toast, surface
  the error. The copies had drifted — `fuel-delete-dialog` never called `router.refresh()`
  and did not await `fetchVehicles()`, so a deletion could leave stale server-rendered data
  on screen.
- Badge toasts move into the hook, so any action returning `newBadges` announces them
  without each caller repeating the `setTimeout`.
- New `SubmitButton` replaces the hand-rolled spinner/disabled/height combination in each
  form.
- Applied to the charge, fuel log, fuel edit, battery check-in and fuel delete surfaces.
  `update-odometer-modal` and the maintenance forms still use their own flow — their actions
  return `{ error }` rather than `{ success }`, so converting them means changing the action
  contract, which is left as a separate change.

### Audit — formatting, dead code, half-wired settings (2026-08-08)

- `formatting.ts` gains `formatMoneyExact`, `formatMoneyCompact`, `formatNumber`,
  `formatDistance`, `formatDayLabel` and `formatTableDate`, replacing hand-rolled
  `Intl.NumberFormat` instances in six files. Four of those built their currency prefix from
  `currency || "$"` instead of `getCurrencySymbol`, so a rupee user saw `$` on the fuel,
  maintenance and cost-trends pages.
- `distance-trends-panel.tsx` had a private `median`; it now uses `statistics.ts`.
- Removed `isLowerBetterEvUnit` and the fuel page's local `convertChargeEfficiency`
  reimplementation — both had no caller doing anything the shared code did not already do.
- Wired up the EV efficiency unit preference. The store, the server action and the database
  column all existed; the profile page had no selector, so `EV_EFFICIENCY_UNITS` was
  unreachable and the setting could never be changed.
- `summarizeChargingLoss` surfaces the gap between metered energy and what reached the pack,
  which is what explains a per-kWh figure that disagrees with the vehicle's own display.
- Reworded the running-cost strings: inference is cold-start only now, so "Home charging
  (estimated)" was describing behaviour that no longer exists.
- Marked the energy half of `docs/ev-redesign.md` superseded, keeping the battery-health half
  as the live reference.

### UI — a charge form that knows how you were billed (2026-08-08)

- New `src/components/ev/charge-session-form.tsx`. Pricing-mode tabs (per unit / per minute /
  flat / free) show only the fields that mode needs, with session fee, idle time and tax
  behind a disclosure. A live summary prices the session using the same functions the server
  does, so the preview is the figure that gets saved.
- "Enter the amount myself" overrides the calculated total. That switch is what makes an
  unmodellable tariff loggable — the receipt always wins over the arithmetic.
- Home charging gets a first-class form instead of being inferred, with the profile
  electricity tariff prefilled as the per-unit rate.
- "Charged to 100%" appears only when no end percentage was given, which is exactly when it
  is the sole reference point efficiency can use.
- Editing a charge now opens the same form. The old edit modal silently carried charge fields
  through untouched, so a wrong tariff could never be corrected.
- `fuel-log-modal.tsx` splits into a liquid form and the charge form rather than one form
  with `isCharge` branches through every field.
- The EV panel gains a Charging Efficiency card (distance per kWh paid for, with the method
  and confidence stated) and a Pack Capacity card.

### Analytics — efficiency from charge-to-charge segments (2026-08-08)

- Rewrote `ev-energy-analytics.ts` around logged sessions. `buildChargeSegments` walks the
  charge history and attributes each session's energy to the driving that preceded it,
  rescaled by `socUsed / socAdded`. No full charge required; when both ends happen to sit at
  100% the ratio is 1 and it is the full-tank method exactly.
- Sessions logged without percentages fall back to full-charge anchors, accumulating partial
  sessions in between. With neither reference point a segment simply produces no efficiency,
  and the sessions are counted as unanchored rather than guessed at.
- Segments are outlier-filtered on median absolute deviation, and a session credited with
  more than 4x the charge it delivered is refused outright — both catch an unlogged session
  sitting inside a segment.
- `summarizePackCapacity` turns full charges into a state-of-health figure in kWh.
- Inferred home charging is now cold-start only: the moment one session exists for a period,
  topping the totals up with `distance x Wh/km` would corrupt a number the owner can check
  against their electricity bill.
- Battery care counts a full charge logged via `charged_to_full`, not just via `end_soc`.
- New `src/utils/statistics.ts` holds median, MAD, outlier bounds, consistency and
  least-squares slope, which `battery-health.ts` had its own copies of.

### Schema — charge sessions carry a real tariff (2026-08-08)

- Migration `20260808000000_charge_pricing_modes.sql` adds `pricing_mode`, `rate_per_unit`,
  `duration_minutes`, `session_fee`, `idle_minutes`, `idle_rate_per_minute`, `tax_percent`,
  `charged_to_full` and `energy_basis` to `fuel_logs`. The cost columns are the four OCPI
  tariff dimensions, so per-kWh, per-minute, idle and connection fees all have a home and
  tiered/time-of-use/dynamic pricing needs no new mode. Existing charge rows backfill to
  `per_kwh` with the unit rate recovered from stored kWh and cost.
- New `src/utils/charge-session.ts`: session pricing, energy resolution (metered kWh, or
  derived from the SoC delta for per-minute chargers), pack-capacity measurement from a full
  charge, and charging-loss estimation. `total_cost` stays authoritative — the rate
  arithmetic only fills a gap, so a tariff we cannot model is still logged accurately.
- `submitFuelLog` / `editFuelLog` persist the new columns and can price a session from its
  components when no total is supplied.
- Replaced seven near-identical `makeFuelLog` / `makeVehicle` builders across the test suite
  with `src/__tests__/factories.ts`. Widening `FuelLog` used to break every one of them.

### Docs — EV charging redesign plan (2026-08-08)

- Added `docs/ev-charging-redesign.md`, superseding the energy half of `docs/ev-redesign.md`.
  Charging returns to being a logged event, home included; inference is demoted to a
  labelled cold-start fallback.
- Settled the "wait for a 100% charge?" question: no. SoC-corrected charge-to-charge segments
  cover every case and collapse to the full-tank method when both sessions do end at 100%. A
  full charge is repurposed as a *pack capacity calibration*, which is the one thing it is
  genuinely needed for.
- Researched the public-charger tariff taxonomy against OCPI and current Indian/US network
  pricing. Four dimensions (`ENERGY`, `TIME`, `PARKING_TIME`, `FLAT`) close the space;
  everything else is a modifier. Modularity will be baked in at that shape.
- Added the changelog and the commit/test/changelog workflow rules to `CLAUDE.md`.
