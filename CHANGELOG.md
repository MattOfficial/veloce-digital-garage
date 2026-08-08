# Changelog

All notable changes to Veloce Digital Garage, newest first. One entry per commit.

Started 2026-08-08. Nothing before that date is recorded here — see the git history instead.

## Unreleased

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
