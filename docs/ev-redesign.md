# EV Implementation Rethink

Branch: `feat/ev-vehicle-redesign`
Status: implemented (sections 1–6). Deferred items are listed in section 9.

## 1. The problem with what we have today

Today an EV is modelled as an ICE vehicle with the units swapped out:

- `fuel_logs.fuel_volume` holds kWh instead of litres (see the comment in `src/types/database.ts:59`)
- `fuel_logs.fill_type` is `full` / `partial`, and `src/utils/fuel-analytics.ts` runs the **full-tank method** over charge logs — it accumulates volume across partial fills and closes a segment on the next "full" entry
- Efficiency is `distance / volume`, surfaced as `km/kWh` (`src/app/dashboard/fuel/page.tsx:205`)
- `src/utils/cadence-predictions.ts` predicts the *next refill*
- `src/utils/efficiency-units.ts` has no EV branch at all — it only knows km/L, L/100km, MPG

Four things break:

**Charging is ambient, not an event.** A petrol car is refuelled every 1–2 weeks, always at a station, always with a receipt. An EV — especially a scooter — is plugged in at home every night or every other night. That is 5–10× more events, none of them memorable. Nobody is going to log them, and a metric that depends on complete event logging silently rots the moment the user misses a few.

**Home charging has no measurable kWh and no cost.** There is no pump display and no receipt. The energy shows up inside a monthly electricity bill, mixed with the fridge and the AC, often on a slab tariff. Asking the user for kWh at home means asking them to guess — and a guessed denominator produces a garbage efficiency number that then poisons every downstream chart.

**"Full charge" is the wrong discipline and, worse, an unnecessary one.** The full-tank method exists because petrol gauges are useless — the only repeatable reference point is a full tank. An EV has a *digital fuel gauge with 1% resolution*. We are forcing EV owners into a coarser, higher-discipline protocol than their vehicle already gives them for free. That is the central design error.

**The metrics we compute are not the ones EV owners care about.** We give them mileage and cost-per-fill. What they actually worry about is battery health, and we do not measure it at all.

## 2. The reframe

> Petrol is a **purchase**. Electricity is a **utility**.
> Therefore: stop logging charge events. Start sampling vehicle state.

Two decoupled primitives replace the single `fuel_log`:

### A. Energy spend — a *period* concept, mostly inferred

- **Home charging is never logged.** It is derived: `distance in period × Wh/km − public kWh logged`, costed at the user's tariff. Clearly labelled as an estimate, correctable once a month.
- **Public charging is logged**, exactly as a fill-up is today — it is infrequent, has a real cost, a real kWh number, and usually an in-app receipt we can OCR. Add charger type (AC / DC fast), network, and location.

### B. Battery state check-in — the high-value, low-cost data point

A snapshot: `date, odometer, SoC%`, optionally the displayed range. One line, entered maybe weekly, or via Copilot ("odo 4120, battery 62%").

Two snapshots with no charge in between give us everything:

```
km per % SoC       = (odo₂ − odo₁) / (soc₁ − soc₂)
usable range @100% = km_per_pct × 100
energy used        = (soc₁ − soc₂)/100 × usable_battery_kwh
Wh/km              = energy_used_Wh / distance_km
```

No kWh meter. No cost. No "did I charge it all the way." **SoC delta is the EV equivalent of the full-tank method, and it is strictly better** — higher resolution, no protocol for the user to remember, and it works on a partial charge.

## 3. Metrics: what an EV dashboard should show

| ICE hero metric | EV replacement | Why |
|---|---|---|
| km/L this tank | **Wh/km, rolling 30d** | Global EV standard; lower-is-better matches L/100km intuition. Offer km/kWh and mi/kWh as display prefs. |
| — | **Battery health — usable range at 100% vs. baseline** | *The* EV ownership anxiety. Drives resale value and whether the vehicle still fits their life. We currently measure nothing here. This should be the hero card. |
| Cost per fill | **Cost per km + monthly running cost** | Per-session cost is meaningless when most sessions are inferred. |
| — | **Savings vs. petrol equivalent (₹ this month / lifetime)** | The emotional payoff of EV ownership and the single best engagement hook we have. `distance × (petrol_price / ref_ice_efficiency − ev_cost_per_km)` |
| Days to next refuel | **Days of range left** | `current_SoC% × km_per_pct / avg_daily_km`. More actionable than a refill date because charging is nightly. |
| — | **Charging mix — home / AC public / DC fast** | Cost accuracy plus a genuine battery-health input. |
| — | **Battery care score** | Count of deep discharges (<20%), charges to 100%, DC-fast share. Coaching here is real differentiation and needs no extra logging. |

Battery health deserves the treatment `distance-trends.ts` already gives distance — a smoothed trend with an explicit confidence band, a minimum sample count before we show a number, and honest "not enough data yet" states. Range-derived SoH is noisy (temperature, ride mode, load, terrain), and a degradation figure presented with false precision is worse than none.

### Maintenance is a different list, too

EVs are not low-maintenance versions of ICE vehicles — they have a *different* wear profile. No oil, filters, or plugs. But: **tyres wear noticeably faster** (instant torque plus pack weight), the **12V auxiliary battery** is a top-three failure point, brake fluid still ages even though regen means pads last far longer, and some EVs have battery coolant. For a scooter: belt/chain drive, brake pads, tyres, 12V. The default service catalogue for `powertrain = 'ev'` should reflect this rather than inheriting the ICE list.

## 4. Making it easy for the user

The target: **an EV owner who logs nothing after setup still gets a correct cost-per-km and a plausible efficiency number.**

1. **Two setup questions.** Electricity tariff (₹/unit) and battery capacity — the latter prefilled from a small model catalogue (Ather 450X, Ola S1, Nexon EV…). Efficiency seeds from the catalogue too, then self-corrects from real data.
2. **Never ask "full or partial."** Delete the concept for charge rows.
3. **SoC check-in as the primary action.** Replace the EV "Add charge" CTA with "Update battery" — odometer + SoC, two fields. `update-odometer-modal.tsx` already does half of this; generalise it. Copilot NLP should parse `"4120 at 62%"`.
4. **Public charge = the existing modal**, plus charger type and start/end SoC — and if they give SoC deltas we can derive kWh ourselves.
5. **Monthly reconciliation nudge.** "Estimated home charging last month: ₹340 (46 kWh). Looks right?" — accept in one tap, or correct it and every derived number re-bases.
6. **OCR the charging screenshot.** Ather Grid and most public networks show a session summary in-app. Our Gemini pipeline (`src/app/actions/ocr.ts`) already handles receipts; a session screenshot is an easier parse than a paper invoice.

## 5. Data model

**`vehicles`** — add `usable_battery_kwh` (distinct from rated `battery_capacity_kwh`), `rated_range_km`, `baseline_range_km` (the measured usable range early in ownership — the denominator for SoH), `battery_warranty_years`, `battery_warranty_km`.

**`users`** — add `electricity_tariff_per_kwh`, `petrol_price_reference` and `ice_reference_efficiency` (for the savings metric), `ev_efficiency_unit` (`Wh/km` | `km/kWh` | `mi/kWh`).

**`fuel_logs`** — keep the table (renaming is expensive; alias it as `EnergyLog` in the type layer). Add `charge_source` (`home` | `ac_public` | `dc_fast` | `other`), `start_soc`, `end_soc`, `is_estimated`, `charger_network`, `location`. Make `fill_type` nullable and ignored when `energy_type = 'charge'`.

**`vehicle_snapshots`** — new, and the backbone of everything above: `id, vehicle_id, date, odometer, soc_percent (nullable), displayed_range (nullable), source ('manual'|'ocr'|'api'), notes`. Nullable SoC means this table also serves ICE vehicles as a plain odometer update, which lets us fold in the existing odometer modal rather than maintaining two paths.

## 6. Code changes

- `src/utils/efficiency-units.ts` — add an EV branch (Wh/km, km/kWh, mi/kWh, kWh/100km). Today it is liquid-fuel only.
- **New** `src/utils/ev-energy-analytics.ts` — SoC-delta segments plus public-charge events. Charge streams stop going through the full/partial segment logic in `fuel-analytics.ts`; that function stays as-is for liquid fuel.
- **New** `src/utils/battery-health.ts` — km/% trend, usable range at 100%, degradation %/year, projection against the warranty threshold, confidence banding.
- `src/utils/cadence-predictions.ts` — for EVs, "days of range left" rather than a next-refill date.
- `src/utils/ownership-analytics.ts` — add savings-vs-ICE and split inferred vs. actual energy cost.
- `src/utils/copilot-analytics.ts` and `nlp-engine.ts` — teach the Copilot the SoC check-in intent and battery-health questions.
- `src/app/dashboard/fuel/page.tsx` — for EVs this becomes an Energy & Battery page; the hero card is battery health, not mileage.

## 7. Migration and edge cases

- Existing charge logs stay. Backfill `charge_source = 'other'`, `is_estimated = false`. Historical charts keep rendering; they just stop being the source of truth for efficiency once snapshots exist.
- Gate everything on `powertrain IN ('ev','phev','rex')`. ICE behaviour is untouched.
- **PHEV is the genuinely hard case** — it needs both streams simultaneously, and distance has to be attributed between electric and petrol miles, which SoC deltas alone cannot do. The existing tabbed UI is the right shell; each tab should use its own method, and we should accept that PHEV electric-share will be approximate.
- **Slab tariffs.** Indian domestic electricity is usually slab-priced, so a flat ₹/unit is an approximation. Ship the flat rate, label estimates clearly, and let the monthly reconciliation absorb the error.
- **Cold-start.** With zero snapshots, fall back to catalogue efficiency × distance × tariff, and say so in the UI rather than presenting it as measured.

## 8. What shipped

- `supabase/migrations/20260806000000_ev_redesign.sql` — `vehicle_snapshots` with RLS, EV columns on `vehicles`, reference rates on `users`, charge columns on `fuel_logs`, `fill_type` relaxed to nullable
- `src/utils/battery-health.ts` — discharge segments, km per %SoC, usable range, state of health, degradation trend, confidence banding
- `src/utils/ev-energy-analytics.ts` — inferred home energy, charging mix, cost per distance, savings vs petrol, battery care score
- `src/utils/efficiency-units.ts` — Wh/km, km/kWh, mi/kWh, kWh/100km
- `src/app/actions/snapshots.ts` — check-in CRUD, feeding the odometer sync
- `src/components/battery-check-in-modal.tsx` and `src/components/ev/energy-battery-panel.tsx`
- `/dashboard/fuel` renders the Energy & Battery panel for `powertrain = 'ev'`; the ICE path is untouched
- Profile settings for tariff and petrol reference; battery attributes on the vehicle editor

Two changes reach beyond the EV path and are worth knowing about:

- **Charge streams no longer produce efficiency segments.** `buildFuelAnalytics` records charge rows but derives nothing from them, because most EV energy is never logged. Anything that read `analytics.charge.closed_segments` now reads empty.
- **Snapshots are an odometer source.** `distance-analytics.ts`, `distance-trends.ts` and `vehicle-metrics.ts` all read `vehicle_snapshots` alongside fuel logs. Without this an EV that stopped logging charges would have no distance history at all.

## 9. Deferred

- **Monthly reconciliation.** Inferred home cost is shown and labelled as an estimate, but there is no "was this right?" prompt yet, so the estimate never gets corrected against a real bill.
- **EV maintenance catalogue.** The service list is still the ICE one. Tyres, 12V auxiliary battery, brake fluid and coolant intervals are the ones that matter here.
- **PHEV charge analytics.** A plug-in hybrid records both streams but electric distance attribution is not solved; the charge side shows sessions without efficiency.
- **Model catalogue.** Battery capacity is typed in by hand rather than prefilled per model, so the two-question setup is really two questions plus a lookup the owner has to do themselves.
- **Copilot SoC check-in intent.** The Copilot answers EV efficiency questions from battery health, but cannot yet record a check-in from "4120 at 62%".
