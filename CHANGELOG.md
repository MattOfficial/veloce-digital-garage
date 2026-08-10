# Changelog

All notable changes to Veloce Digital Garage, newest first. One entry per commit.

Started 2026-08-08. Nothing before that date is recorded here — see the git history instead.

## Unreleased

### Reports: the Excel workbook (2026-08-10)

- `report-xlsx.ts` builds a sheet per record type — Summary, Fuel & Charging, Maintenance,
  Odometer, Vehicles, and Tyres when there are any — with frozen headers, autofilter, column
  widths and per-column number formats. Sheets appear only for the sections that were picked,
  and the tyre tab is skipped entirely rather than shipped as bare headings.
- **No apostrophe guard here, deliberately.** A string written to `.xlsx` is stored as a
  shared string and Excel never evaluates one, so the injection that makes CSV dangerous does
  not exist in this format — while adding the prefix anyway would show the apostrophe as part
  of the value and corrupt the notes it was meant to protect. A test pins the behaviour, so if
  exceljs ever starts promoting a leading `=` into a formula cell we find out.
- **Dates are anchored at local noon.** Excel stores a date as a day number and the conversion
  runs through the host timezone; midday means no offset within ±12h can land the value on the
  day before or after. That is a silent off-by-one on every fill logged at midnight.
- Cost columns total with a live `SUM` carrying a cached result, so the figure is right in
  readers that do not recalculate and still correct after the user deletes a row.
- The Summary sheet states that the headline total counts fuel, charging and service only —
  custom-tracker costs are outside a report, so it is lower than the figure on Trends, and
  saying so beats letting someone find the discrepancy themselves.

### Reports: the CSV ledger (2026-08-10)

- `report-csv.ts` writes one flat, chronological ledger across fuel, charging, service and
  odometer records rather than a file per type, so it opens anywhere and pivots without
  preparation. Excel will get the per-type sheets; this is the lowest common denominator.
- **Free text is treated as hostile.** `notes`, `location`, `charger_network` and
  `service_type` are all user-typed, and a cell starting `=`, `+`, `-`, `@`, tab or CR
  executes as a formula when the file is opened in Excel. Those are prefixed with an
  apostrophe. Only *text* cells go through the guard — running numbers through it would turn
  every negative amount into text.
- Costs are written as raw numbers, not formatted money: a spreadsheet cannot sum "₹1,200.00".
  The currency and distance units are named in the column headers instead.
- The file opens with a UTF-8 BOM. Without one, Excel on Windows reads the file as the system
  codepage and every ₹ arrives as mojibake.
- `report-format.ts` builds download filenames. The slug is an allowlist of `[a-z0-9-]`, which
  is what makes it safe to interpolate into `Content-Disposition` — a nickname holding a
  quote, a newline or `../` cannot travel into the header. A title with no Latin characters
  slugs to nothing, so the scope stands in rather than the file arriving called `-`.
- Report copy added to `ui.ts` under `reports`, shared by the CSV and the coming Excel writer.

### Reports: the range and dataset core (2026-08-10)

- First step of downloadable PDF/Excel/CSV reports. `report-range.ts` resolves the seven
  window presets into a pair of inclusive `YYYY-MM-DD` bounds, and `report-dataset.ts` turns
  vehicles plus a window into the one structure all three formats will walk.
- **Why one dataset rather than three writers:** three independent readings of "total spent"
  is three chances to disagree. Every cost figure is derived from the rows the dataset emits,
  so a report always totals exactly what it shows — including when a section is switched off.
  Distance is the deliberate exception, and the module says why.
- **Ranges stay in string space.** Log dates are bare calendar dates; parsing them into `Date`
  to compare would reintroduce a timezone the data never had, and a fill logged on the 1st
  would drop out of a window starting on the 1st for anyone west of UTC.
- **Efficiency is measured over full history, then filtered by closing date.** Building
  segments from the windowed logs alone restates every segment straddling the window's start,
  because the fill that sets its odometer baseline sits outside. On the test fixture that is
  the difference between 20 km/L and 40 km/L. Both energy modes go through the same path —
  fuel via `closed_segments`, charge via `buildChargeSegments`.
- Averages are distance-weighted; a 600 km segment says more about economy than a 40 km one.
- A garage mixing petrol and electric has two efficiency units and no shared axis. Rather than
  drop the chart, the mode with more measured segments wins and the series names the vehicles
  it covers, so the caption can say what was left out.
- `resolveFuelVolumeUnit` added next to its siblings in `efficiency-units.ts`: nothing stores
  the volume unit, and the report needs the same miles-plus-pounds-means-imperial rule the
  user store applies. The store still has its own copy — worth collapsing separately.
- `@react-pdf/renderer` and `exceljs` installed and marked external, so ~3MB of server-only
  machinery stays out of the client bundle.

### Efficiency pulse was blank for EVs, and one metric card for the whole app (2026-08-09)

- **Bug:** an EV showed a real efficiency figure on Energy & Battery and an em dash on the
  dashboard. Two surfaces, two derivations: the dashboard read `whPerKm` off battery health,
  which is measured from state-of-charge check-ins, while the EV page measured distance per
  unit *bought* from charge sessions. An owner who logs charges but has never recorded a
  check-in had the first and not the second.
- **Fix:** new `getEvEfficiencyDisplay` is the single derivation behind both, so they cannot
  disagree again. The dashboard also now honours the owner's chosen efficiency unit instead of
  defaulting from the distance unit, and names what the number was measured from — "Lifetime",
  "From your battery percentages" — the way the EV page already did.
- `ui.ev.efficiency.method` / `methodMixed` collapsed into one `basis` record keyed by the
  same values the util returns, so a new basis cannot be added without copy for it.
- **Cards:** the coloured wash, icon chip and tinted value from the EV page's headline row is
  now the app's only headline-metric surface. The dashboard's Efficiency pulse, the
  maintenance vitals row, both insights panels and the profile's distance snapshot all render
  `MetricCard`; the two near-identical private copies of it in `cost-trends-panel` and
  `distance-trends-panel` are gone. Added `teal` and `sky` tones to cover distance and data
  quality, and long values now wrap rather than widen their column.
- Maintenance had drifted furthest — `font-black` numbers with a coloured drop shadow, and a
  service table using `bg-white/5` on `bg-black/20`, which in light mode is white on white
  under a dark wash. It now matches the fuel table it sits one click away from. Same for the
  profile form inputs, whose `border-white/10` was invisible against a light background.

### Fix — petrol vehicles were shown the EV charge form (2026-08-09)

- **Bug:** after viewing an EV, switching to a petrol vehicle and opening "Log Fill-Up" gave
  the charge form — units in kWh, charger type, "Charged to 100%" — with no way to record a
  litre. Any fill-up logged that way would have been stored as a charge session.
- **Cause:** `FuelLogModal` seeded its energy type with
  `useState(isEV ? "charge" : "fuel")`. A `useState` initialiser runs once, and the modal
  keeps its place in the tree across a vehicle switch, so the value stayed on `charge` from
  the EV. The header read the powertrain directly, which is why it correctly said "Log
  Fill-Up" above a charge form.
- **Fix:** the energy type is derived from the powertrain on every render via new
  `resolveEnergyType`. Stored preference is consulted only for plug-in hybrids, the one case
  where the owner is actually offered a choice, so a petrol vehicle cannot reach the charge
  form whatever the state holds.
- Swept the codebase for the same pattern: `fuel/page.tsx` and `cost-trends-panel.tsx` were
  already safe because both gate their stored mode behind a powertrain check at read time.
  Their duplicated `phev || rex` predicates now share `canChooseEnergyType`.

### Nav — "Fuel History" no longer shown for an EV (2026-08-08)

- The sidebar entry now follows the selected vehicle rather than the route: an EV gets
  "Energy & Battery" with a battery icon, matching the page title. `/dashboard/fuel` renders a
  completely different page for a pure EV, so a fixed label was always going to be wrong for
  one of them.
- Kept "Energy & Battery" over "Charge & Battery": charge *is* a property of a battery, so
  that pairing is redundant, and "energy" covers the electricity bought as well as the
  consumption figures. It also already matched the page heading.
- Plug-in hybrids keep the fuel wording, because they keep the fuel page.

### Activity heatmap — new palette and a third category for charging (2026-08-08)

- **The brown was arithmetic, not taste.** Cells were one colour at rising opacity, and amber
  at 30% over the near-black card composites to `#563e19` — brown by construction. Since most
  days carry one or two activities, most of the grid sat on the two brownest steps.
- Replaced with four *solid* steps per category, defined in oklch in `globals.css` so each
  theme picks its own lightness curve: dark mode brightens with activity, light mode deepens.
- Chroma is set to a fraction of the most sRGB can display at each lightness, so the busiest
  step is always the most saturated rather than washing out at the gamut ceiling.
- The lightness range differs per hue, which is the part that actually fixes the brown: amber
  has to stay light or it turns brown, violet has to stay darker or it turns white. A single
  shared range cannot serve both.
- **Third category.** Charging is now its own colour: fuel amber, charge teal-to-cyan,
  maintenance violet. The split is on the log's `energy_type`, not the vehicle's powertrain,
  so a plug-in hybrid correctly appears under both.
- Days with more than one category show hard colour bands rather than a blend — two colours
  faded together make a third that means nothing at 12px.
- The legend gains Charge and shows the actual four-step ramp, so "stronger colour" has
  something to refer to. Day summaries list only the categories present, so a petrol-only
  garage never reads "0 charges".

### Styling — EV headline cards now match the petrol ones (2026-08-08)

- The petrol page's summary cards had a coloured wash, an icon chip and a value in the
  metric's own hue; the EV page's four tiles were flat grey boxes with white numbers. One
  vehicle switch apart, that read as the EV page being unfinished rather than different.
- New shared `MetricCard` carries the whole treatment, and both pages now use it — the two
  cannot drift apart again, which is how they got here.
- EV tones: efficiency emerald and cost rose, matching their petrol equivalents so the same
  metric keeps the same colour across vehicles; savings amber, total charged blue.
- `hint` accepts nodes as well as text, which the fuel-price card needs for its coloured
  trend clause.

### Fix — EV charge pills looked unstyled next to the petrol ones (2026-08-08)

- The "Billed" column rendered plain muted text while the equivalent column on the petrol
  table was a pill, so the EV rows had a bare gap where the petrol rows had colour. It is now
  a pill toned per pricing mode, in colours that do not collide with the source column beside
  it.
- The `neutral` tone was the real culprit for rows that looked blank. Its *text* contrast was
  never the problem — 9.04:1 in dark mode — but the chip background separated from the row
  behind it by only **1.18:1**, so the pill shape was invisible and it read as unstyled text.
  Charge sources backfilled to `other` by the earlier migration all landed on this tone.
  Strengthened to slate-500/20 with slate-800 text in light and slate-300/15 with slate-100 in
  dark, lifting chip-vs-row separation to 1.46:1 while keeping text at 10.7:1 and 9.96:1.
- Neutral needs more lightness separation than the coloured tones because it has no hue to
  distinguish it — the others are told apart by colour, not brightness.

### Styling — fuel page charts and empty states, plus light-mode fixes (2026-08-08)

- **Five light-mode bugs on the fuel page.** The no-data card was `bg-white/5` with a
  `border-white/10` — white on white, effectively invisible in light mode. Two chart headers
  used `border-b border-white/5`, so their separator vanished. The efficiency-unit dropdown
  used `focus:bg-white/10`, meaning keyboard focus was invisible in light mode, and its
  container used `border-white/10`. All now use theme variables, per the light-mode rule in
  `CLAUDE.md`.
- The three trend charts get gradient headers with icon chips in their own hue (efficiency
  emerald, unit price blue, battery range violet), gradient area fills instead of flat ones,
  and coloured hover cursors.
- The efficiency trend became an area chart to match the other two; it was the only line
  chart of the three.
- Empty state gets a coloured icon tile instead of a bare grey glyph.

### Styling — colour and highlights on the history tables (2026-08-08)

- New `Pill` primitive with eight tones, each carrying a background, text colour and hairline
  border for both themes. Replaces the hand-written Tailwind strings the two tables had
  drifting copies of.
- Fuel history: rows are tinted by energy type with a colour rail on hover, fill type and
  efficiency become pills, numerics are `tabular-nums` so columns stop jittering, and the
  three summary cards get a coloured wash, an icon chip and a value in their own hue.
- Charge history: charge source is colour-coded (home violet, public AC cyan, DC fast orange)
  so the expensive sessions stand out from the routine ones; a full charge shows an emerald
  battery pill, since that is the session that measures pack capacity; free sessions read as
  a pill rather than ₹0.00.
- **Contrast measured, not eyeballed.** Composited every pill against the tinted row and
  computed WCAG ratios: cyan-700 came in at 4.42 and orange-700 at 4.21, both below the 4.5
  needed for 12px text, and emerald-700 cleared it by only 0.02. All three moved to their
  -800 shades. Muted cell text at 60–70% opacity measured 2.5–3.0 and went back to full.
  Worst case across both themes is now 4.88:1.

### EV page — one headline row, and cards that earn their place (2026-08-08)

- **Bug:** the Running Cost card's "Efficiency" tile read `health.whPerKm`, which comes from
  SoC check-ins, not from charges — so it stayed blank for anyone who logged charges but
  never recorded a check-in. It now reads the charge-derived figure, which has a lifetime
  fallback and works from the first session.
- **Restructured the page around what an owner can see today.** Four headline tiles
  (efficiency, cost per distance, saved vs petrol, total charged) and the charge history come
  first, because those work from one logged session. Battery health, pack capacity, charging
  mix and battery care now render *only* once they have something to say. An empty card in a
  prominent position reads as a broken feature rather than a future one.
- Dropped the standalone Running Cost and Charging Efficiency cards; they duplicated each
  other and are now the headline tiles. Charging mix also needs at least two sources before
  it appears — a single-bar chart says nothing.
- Range Left moved into Battery Health, since both depend on check-ins.
- Anything hidden is listed in one quiet "More to unlock" panel at the bottom, saying what
  each metric needs. Chose this over a show/hide setting: it needs no configuration and no
  understanding of the metrics before you have seen them.
- Default EV efficiency unit is now km/kWh rather than Wh/km. Both units remain selectable in
  the profile; the default now matches how owners reason about a charge, and stops kilometre
  users getting a consumption unit while mile users get an economy one.

### EV page — charge history, working efficiency, real savings (2026-08-08)

- **Charge history table.** The EV page returned early with only the analytics panel, so a
  logged session could not be seen, corrected or removed. New `ChargeHistoryTable` lists every
  session with where, how it was billed, energy, cost, effective rate and battery, and wires
  edit and delete to the same modals the petrol page uses. SoC-derived energy is marked, so a
  derived figure is never mistaken for a meter reading.
- Pagination moved into a shared `TablePagination`; the petrol table now uses it too rather
  than carrying its own copy.
- **Efficiency shows from the first charge.** It needed two charge-to-charge segments, so a
  single session displayed nothing. It now falls back to lifetime distance over lifetime
  energy — capped at low confidence and labelled, because that ratio counts the charge still
  in the battery as though it had been ridden.
- **Savings compares against your own garage.** It previously needed a petrol price and
  economy typed into the profile. It now measures the owner's petrol vehicles of the same
  class, pooled by distance so a heavily-used vehicle counts for more, and never compares a
  two-wheeler with a car. Plug-in hybrids are excluded (part grid energy); self-charging
  hybrids count. Falls back to the profile reference, then to researched Indian averages —
  ₹2.25/km for a two-wheeler and ₹8/km for a car — which are withheld from a garage priced in
  another currency. The card always states which source it used.

### Fix — say when a save failed because a migration is pending (2026-08-08)

- `submitFuelLog` returned a flat "Failed to save fuel log" and left the real cause in a
  server-side `console.error`, which does not reach the browser console. A pending migration
  therefore presented as a mysterious app bug with nothing to go on.
- New `getDatabaseErrorMessage` recognises `PGRST204` and Postgres `42703` — both mean the
  table lacks a column the code writes to — and says so, naming the column and the command to
  run. Every other database error now carries its message through instead of being swallowed.
- Applied to the insert, update and delete paths in `fuel.ts`.

### Fix — entering kWh was rejected, and a full charge now skips the percentages (2026-08-08)

- **Bug:** typing the units consumed still produced "Enter the units consumed, or both battery
  percentages", and the summary showed a zero total. `useWatch` returns the raw value of a
  number input, which is a *string*, and `Number.isFinite("2.6")` is `false` — it does not
  coerce. So the live preview read every numeric field as absent, and `onSubmit` validated
  against that preview. New `src/utils/form-values.ts` coerces watched values at the
  boundary, and submission now validates the zod-parsed values instead of the preview.
- The same bug silently zeroed the rate, duration, tax and idle fields in the preview, so the
  calculated total was wrong for every pricing mode, not just per-unit.
- **"Charged to 100%" now genuinely replaces the percentages.** It moved above the SoC
  fields, states that they are optional, and hides the end-percentage field, which a full
  charge already answers. Switching it on clears any end value so a stale figure cannot be
  submitted from a hidden field.
- When a full charge is logged with units, the summary works backwards and shows the implied
  start percentage. It stays a hint and is never stored: metered energy includes charging
  losses so it overstates the swing, and storing a percentage derived from energy would make
  `measurePackCapacity` circular — it divides energy by that same percentage.
- Per-minute and flat sessions no longer attach their "no energy" error to a units field they
  never render; it lands on the percentages, with wording that says why.

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
