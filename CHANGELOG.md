# Changelog

All notable changes to Veloce Digital Garage, newest first. One entry per commit.

Started 2026-08-08. Nothing before that date is recorded here — see the git history instead.

## Unreleased

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
