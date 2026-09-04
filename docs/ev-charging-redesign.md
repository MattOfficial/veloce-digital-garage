# EV Charging Redesign — logged sessions, real tariffs

Branch: `feat/ev-metrics-redesign`
Supersedes the energy half of [ev-redesign.md](ev-redesign.md). The battery-health half of
that document (SoC snapshots, state of health, km per %) still stands.

## 1. Why the previous design has to go

`ev-redesign.md` bet on one assumption: **home charging is unmeasurable, so infer it.**
Home energy was computed as `distance × Wh/km − public kWh logged`, costed at a flat tariff.

That bet was wrong for the owner we actually have. A home charger is on a meter, a smart
plug, or a submeter, and the owner knows how many units went in. Given that, inference is
strictly worse than the truth:

- **It is circular.** Inferred home energy needs `Wh/km`, which comes from battery health,
  which comes from SoC snapshots. No snapshots means no cost, and every cost figure moves
  when an unrelated health reading lands.
- **It cannot see the tariff the user actually pays.** Slab pricing means the marginal unit
  is not the average unit, and only the user knows which slab their charging pushed them into.
- **It buries the one number the owner can verify.** "46 kWh last month" checked against the
  electricity bill is a fact. `distance × Wh/km` is an opinion.

So: **charging becomes an event again.** Every session is logged — home included — with
whatever the charger or meter reported. Inference stays only as the cold-start fallback,
clearly labelled, for a period with no sessions in it.

## 2. Should efficiency wait for a 100% charge?

**No. But the instinct behind the question is right, and it points at something else that
does need a full charge.**

The instinct is the full-tank method: efficiency needs a *repeatable reference point*. For
petrol, "full" is the only one that exists, because the gauge is useless everywhere else. An
EV has a gauge with 1% resolution — a reference point at every percent. Demanding 100%
throws that away and imposes a discipline the vehicle already spares you.

Three consequences, in order of importance.

### (a) With start and end SoC on each session, no full charge is needed at all

A segment is the driving *between* two charge sessions, `i` and `i+1`:

```
d        = odo(i+1) − odo(i)                        distance driven
ΔS_used  = end_soc(i) − start_soc(i+1)              SoC the driving consumed
ΔS_added = end_soc(i+1) − start_soc(i+1)            SoC session i+1 put back
E_used   = energy(i+1) × ΔS_used / ΔS_added         energy that driving cost
C_used   = cost(i+1)   × ΔS_used / ΔS_added         money that driving cost
```

→ `km/kWh = d / E_used` and `cost/km = C_used / d`.

The ratio `ΔS_used / ΔS_added` is the whole trick: it rescales a session's energy to cover
exactly the driving that preceded it, whatever SoC either session started or stopped at.

The formula needs `end_soc` on every session, but the UI never makes the owner type "100" —
toggling "charged to full" hides that field. The server resolves the gap itself: a session
saved with the flag set and no more specific reading gets `end_soc = 100` written at the
database layer, not just the boolean. Without that, a session logged as "charged to full" is
invisible to this formula (it can only close a segment through the degraded full-charge-anchor
method in (b), and only when the *next* session is also full) even though the owner told us
exactly what we needed to know.

**When both sessions happen to end at 100%, `ΔS_used == ΔS_added`, the ratio is 1, and the
formula collapses to `d / energy(i+1)` — the full-tank method exactly.** Charging to 100% is
therefore a *special case* of the general rule, not a precondition for it. Requiring it would
be choosing to handle one case instead of all of them.

It also resolves a contradiction already sitting in the code: `buildBatteryCareSummary`
**penalises** charging to 100% (`FULL_CHARGE_PENALTY`), and Ather caps its own fast chargers
at 80%. A design that required 100% charges for its headline metric would be coaching the
owner to damage the pack in order to be measured.

### (b) Without SoC, the full-charge anchor is the correct fallback

If the owner logs kWh and cost but no percentages, there is no reference point and the
instinct is right. Then:

- a session flagged **charged to full** becomes an anchor;
- efficiency is computed between two anchors, summing the energy of every session in between;
- segments with no anchor at either end contribute to cost and energy totals but produce no
  efficiency figure — shown as "pending", never as a guess.

This is the classic full-tank method, and `fuel-analytics.ts` already implements it. The EV
path reuses the idea rather than the code, because the SoC-corrected version above is the
primary and this is the degraded mode.

**Precedence: SoC delta → full-charge anchor → no efficiency.** Never a fabricated number.

### (c) Where a 100% charge genuinely earns its keep: pack capacity

A session that runs from a known low SoC up to full measures the battery:

```
apparent_usable_kwh = energy_delivered / (ΔS_added / 100)
```

Wall-meter energy includes charger and onboard-rectifier losses, so this over-reads by the
charging efficiency — roughly 10–15% on AC, 5–10% on DC. It is an **upper bound**, not a
capacity. But the bias is roughly constant per charger type, so while the absolute number is
soft, the *trend* is sound, and that trend is state of health measured in kWh rather than
inferred from range.

So the answer to give the owner is not "charge to 100% to get your mileage". It is: *your
efficiency works from any charge; an occasional full charge calibrates your battery's
capacity.* One is a metric, the other is a calibration, and only the second one needs 100%.

We require `ΔS_added ≥ 50` and `end_soc ≥ 98` before accepting a capacity measurement — a
short top-up divides by a small number and amplifies every rounding error in the gauge.

### (d) Two efficiency numbers, not one

They differ, both matter, and conflating them is how the current page ends up with figures
that do not match the vehicle's own display:

| Metric | Source | Meaning |
|---|---|---|
| **km/kWh (billed)** | energy purchased at the meter | What the money buys. Includes charging losses. |
| **Wh/km (pack)** | `ΔSoC × usable_kwh` | What the trip computer shows. Excludes charging losses. |

Their ratio is charging efficiency, which is worth surfacing on its own — a home setup
quietly wasting 20% in a cheap charger is a finding.

## 3. Public charging tariffs: the full taxonomy

Researched against OCPI — the protocol every European and most Asian networks use to bill
each other for roaming — plus current Indian and US network pricing.

**OCPI defines exactly four tariff dimensions.** That is not one vendor's opinion; it is the
interchange format networks must express their prices in to be billable across borders:

| Dimension | Unit | Seen in the wild |
|---|---|---|
| `ENERGY` | per kWh | Tata Power ~₹17/kWh, ChargeZone ₹20–25/kWh, most DC in India, most of the US |
| `TIME` | per unit time **while charging** | Ather Grid ₹1.2/min + GST, US per-minute networks |
| `PARKING_TIME` | per unit time **plugged in, not charging** | Idle fees, $0.40–1.00/min on US DC networks |
| `FLAT` | fixed, per session | Connection fee, $0–2 typical |

Everything else that looks like a new pricing model is a **modifier over those four**, not a
fifth dimension:

- *Tiered by power* (different rate ≤50 kW vs >50 kW) → a different `ENERGY`/`TIME` rate
- *Time-of-use, peak/off-peak* → a time-restricted `ENERGY` rate
- *Dynamic pricing* (Tesla Supercharger) → an `ENERGY` rate that varies per session
- *Membership / subscription* → a discounted rate, plus a recurring cost that is not a session
- *Free* (Ather Grid outside seven states, destination and mall chargers) → all components zero
- *Prepaid wallet, RFID, app credit* → a payment method, not a price
- *GST and other taxes* → a multiplier on the subtotal

**Conclusion on modularity: yes, bake it in, and it is cheap.** Four nullable rate/quantity
pairs plus a tax rate closes the taxonomy. We are not guessing at future models — we are
adopting the schema the industry already standardised on. Anything a network invents later
either decomposes into these four or is a restriction rule on top of them.

### What the user sees is not four dimensions

Presets, mapped onto the components:

| Preset | Fields shown | Components used |
|---|---|---|
| `per_kwh` | units consumed, cost per unit | `ENERGY` |
| `per_minute` | minutes, cost per minute, start %, end % | `TIME`, energy from SoC |
| `flat` | one price for the session | `FLAT` |
| `free` | nothing | none |

with an always-available **"total paid" override** and an optional extras row (session fee,
idle fee, tax %). The override is the real escape hatch: whatever tariff a network invents,
the owner knows what they were charged. **Rate × quantity is a convenience calculator; the
total is the record.** Analytics read `total_cost`, always.

## 4. Data model

`fuel_logs` gains:

| Column | Type | Purpose |
|---|---|---|
| `pricing_mode` | text | `per_kwh` \| `per_minute` \| `flat` \| `free` |
| `rate_per_unit` | numeric | ₹/kWh or ₹/min, per the mode |
| `duration_minutes` | numeric | `TIME` quantity |
| `session_fee` | numeric | `FLAT` component |
| `idle_minutes` | numeric | `PARKING_TIME` quantity |
| `idle_rate_per_minute` | numeric | `PARKING_TIME` rate |
| `tax_percent` | numeric | GST and friends |
| `charged_to_full` | boolean | the anchor flag from §2(b), asserted by the owner |
| `energy_basis` | text | `metered` \| `soc_derived` — which efficiency the row can feed |

`fuel_volume` keeps holding resolved kWh. `total_cost` stays authoritative and is what every
cost metric reads. `charge_source` (`home` / `ac_public` / `dc_fast` / `other`) is unchanged.

`end_soc` is not purely what the owner typed: `resolveChargeRow` (`src/app/actions/fuel.ts`)
writes `100` into it whenever `charged_to_full` is set and no more specific reading came in.
That is not an inference — the toggle is a direct assertion — and it is what lets a
charge-to-full session participate as `end_soc(i)` in the §2(a) formula rather than only as a
full-charge anchor.

`is_estimated` narrows to its real meaning: rows the app generated for a period with no
sessions logged, not rows the user typed.

## 5. What this replaces

- `buildEvEnergySummary`'s inferred-home arithmetic → session-based totals, with inference
  demoted to a labelled cold-start fallback
- `deriveEnergyFromSocDelta` → folded into a single `resolveSessionEnergy` that also handles
  the per-minute case
- The charge branch of `fuel-log-modal.tsx` → its own modal with the pricing-mode switch and
  live derived-value previews
