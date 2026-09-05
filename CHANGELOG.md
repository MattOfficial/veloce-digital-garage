# Changelog

All notable changes to Veloce Digital Garage, newest first. One entry per commit.

Started 2026-08-08. Nothing before that date is recorded here — see the git history instead.

## Unreleased

### Documentation sweep (2026-09-04)

- **Several `docs/` files had drifted from the code they describe.** `database_schema.md` still
  described `fuel_logs` from before the charging redesign — none of the pricing-mode, SoC, or
  `charged_to_full` columns were listed — and never mentioned `vehicle_snapshots` at all.
  `ui-package-usage.md` described a package at `packages/ui/` importable as `@veloce/ui`, built
  and consumed as a real workspace dependency; the actual package is `packages/veloce-ui/`,
  imported as `@mattofficial/veloce-ui`, and the main app consumes it via a `tsconfig.json` path
  alias straight to source, not a built/linked dependency. `architecture_and_context.md` was
  missing the `/dashboard/reports` route, the `snapshots.ts` server action, and the entire EV
  charging feature from its "what's implemented" list. `ui_and_animations.md` still said to
  never use light-mode Tailwind styles anywhere, contradicting the light theme the app has had
  for a while. `CLAUDE.md`'s Copilot routing description skipped the guardrail/analytics
  classification step that actually runs before the browser-local/server-chat fallback.
- `current-state-audit.md` (dated 2026-03-15) gets a banner pointing at what supersedes it
  instead of a rewrite — it is a point-in-time snapshot, not living documentation.
- Fixed a typo in `packages/veloce-ui/README.md`'s Storybook link
  (`mattrofficial` → `mattofficial`).
- Confirmed still accurate and left unchanged: `docs/reports.md`, `docs/vercel-deployment-guide.md`,
  `docs/ev-redesign.md` (already carries its own supersession banner).

### The Battery Health chart's Y-axis showed nine-digit numbers instead of km (2026-09-04)

- **`buildDischargeSegments` had no finiteness guard on the odometer delta it computes.**
  `soc_percent` was already checked with `Number.isFinite`, but `distance` (from
  `end.odometer - start.odometer`) was not — and a non-finite `distance` fails both `<= 0` and
  `> 0`, so it skipped every rejection check and came out `usable: true` with a fabricated
  `kmPerPercent` of `0` instead of being rejected. Added an explicit finiteness check ahead of
  the existing ones (`invalid-reading`, a new rejection reason), and a matching guard in
  `buildTrend` so a non-finite rate can never populate a monthly bucket even from an unanticipated
  path.
- **The trend chart's own filter let a `NaN` value through.** `health.trend.filter(point =>
  point.usableRangeKm != null)` excludes `null` and `undefined` but not `NaN` — `NaN != null` is
  `true` in JS — so a corrupted month would still reach Recharts as a real data point instead of
  being dropped like every other gap. Switched to `Number.isFinite`.
- **The Y-axis had no tick formatting at all.** Added `tickFormatter` (whole numbers) and
  `allowDecimals={false}` so the axis always renders clean, human-readable km values instead of
  whatever precision the underlying figure happened to carry.

### A calculated units figure still failed to save (2026-09-04)

- **Auto-filling the units field from battery percentages exposed a client/server mismatch on
  usable battery size.** Once a session's units come from percentages rather than a typed
  reading, submitting it omits `fuel_volume` so the server derives the same figure itself — but
  the server read only `usable_battery_kwh`, while every client-side computation (this preview
  included) has always fallen back to `battery_capacity_kwh` when that is unset. A vehicle
  without a distinct usable-capacity figure — the common case — would show the calculated units
  on screen and then have the save rejected with "enter the units consumed", because the server
  saw no battery size to derive them from. `submitFuelLog` and `editFuelLog` now apply the same
  fallback.

### Docs caught up to the charging redesign (2026-09-04)

- **The README still described the design `ev-charging-redesign.md` replaced.** It said home
  charging is inferred and only public sessions are logged — the opposite of current behaviour,
  where every charge is a logged event. Rewrote the EV Tracking section and pointed it at the
  current doc; `ev-redesign.md` stays linked for the battery-health half only.
- **`ev-charging-redesign.md`'s segment formula assumed `end_soc` is always populated,** which
  wasn't true for a "charged to full" session until the previous commit's fix. Documented that
  `resolveChargeRow` writes the literal `100` for that case, not just the flag, and why that's
  what lets those sessions feed the primary SoC-delta method instead of only the degraded
  full-charge-anchor fallback.

### Charging cost per km still needed a lifetime fallback (2026-09-04)

- **The Trends page's charging cost per km card stayed empty even after the segment engine and
  the `end_soc` backfill.** `buildChargeSegments` needs *two* sessions that chain — either
  consecutive SoC readings or two sessions both marked full — and a month of real charging can
  easily not produce one yet (irregular top-ups, or sessions that don't land back to back). The
  card was reading `buildChargeSegments` directly, which has no fallback for that case.
  `summarizeChargeEfficiency` (`ev-energy-analytics.ts`) already has one — a lifetime
  total-cost-over-total-distance ratio, coarse but available from a single logged charge — and
  it's what the Energy & Battery page's own cost-per-km tile already reads. The Trends card now
  reads the same function, with the "cost over time" chart still built from segments directly
  since a lifetime ratio has no trend to plot.

### Charged-to-full sessions were invisible to segments and capacity, not just cost (2026-09-04)

- **"Charged to 100%" was only ever recorded as a flag, never as the reading it asserts.**
  `resolveSessionEnergy` (previous entry) now treats the flag as an implicit `endSoc: 100` for
  the *energy calculation*, but the saved row still left `end_soc` null — so
  `buildChargeSegments`'s SoC-delta chaining, `measurePackCapacity`, and `estimateChargingLoss`,
  which all read the literal column rather than the flag, could never use these sessions. For an
  owner who charges to full via the toggle rather than typing "100", that's most or all of their
  history, which is why the Trends page's charging cost per km card stayed empty even with
  fixes in place. `resolveChargeRow` now writes `end_soc = 100` whenever the flag is set and
  nothing more specific was entered, and a backfill migration
  (`20260904000000_backfill_charged_to_full_end_soc.sql`) does the same for sessions already
  logged before this fix — idempotent, and it never touches a row that already has a real
  reading.
- **Fixed a layout bug in the charge modal's "Units consumed" / "Cost per unit" row.**
  `FormItem` is itself a CSS grid (`grid gap-2`), so nesting it inside another `grid-cols-2` row
  means the outer grid's default `stretch` alignment pushes a shorter sibling's input down
  whenever the other field grows taller — which the new auto-calculated-units hint (previous
  entry) started doing on every charge with percentages filled in. All of the modal's
  `grid-cols-2` rows now set `items-start` so each field keeps its own height instead of
  stretching to match its tallest neighbour.

### Three EV charging bugs (2026-09-04)

- **The Trends page's "Charging cost per km" card never showed a figure, however much data
  existed.** It read `closed_segments` off `fuel-analytics.ts`, whose charge stream
  deliberately never closes a segment — the full-tank method it uses doesn't apply to a
  vehicle charged at home most nights. The card now builds segments with the SoC-corrected
  engine from `ev-energy-analytics.ts` (already used on the Energy & Battery page), which
  segments the driving between charge sessions without needing a full charge. The "Charging
  cost over time" trend chart read the same dead array and is fixed the same way.
- **The charge modal computed units from the battery percentages but never showed them.** The
  "Units consumed (kWh)" field now fills in with the calculated figure as soon as the
  percentages resolve it, and stays editable — typing a real meter reading overrides the
  calculation, and clearing the field hands it back. Submitting an untouched calculated figure
  now omits it from the request so the server derives the same number itself and tags the
  session `soc_derived` rather than `metered`, so pack-capacity and charging-loss measurements
  (which require a real meter reading) don't get corrupted by a number that was never metered.
- **"Charged to 100%" didn't feed its own assumption into the maths.** Turning it on hides the
  end-percentage field but `resolveSessionEnergy` still asked for a numeric `endSoc`, so a
  session with only a start percentage resolved to no energy and no cost. It now treats
  `chargedToFull` as an implicit end reading of 100 wherever it's missing, on both the preview
  and the server.
- Reordered the charge modal so "Charged to 100%" and the battery percentages come before the
  pricing fields — filling percentages first is what makes the units field arrive already
  calculated, so the layout now matches that order.

- **The report claimed a distinction the app could not make.** Every combustion vehicle was
  labelled "Petrol / Diesel", because `powertrain` only says whether an engine is involved —
  nothing anywhere recorded which fuel, and `engine_type` is free text for "2.0L Inline-4".
- New nullable `fuel_type` on vehicles (petrol / diesel / CNG / LPG, constrained in the
  database), asked for in vehicle setup and in the specs editor, and only on powertrains that
  burn something. CNG and LPG are in from the start because they are ordinary here.
- Nullable on purpose: existing vehicles predate the question, so they stay unanswered and
  every surface falls back to the setup form's own wording rather than guessing petrol. A
  wrong fuel on a report is worse than no fuel. Switching a vehicle to electric clears it, so
  a converted row cannot keep showing a stale "Diesel".
- **Every vehicle now gets a garage badge**, not just electric and hybrid ones — a petrol car
  previously had none at all, which read as missing data beside an EV in the same garage. Each
  kind has its own colour and icon, and every badge carries its label, so colour never has to
  carry the meaning alone.
- `getVehicleEnergySummary` is the single source for all of it, so the garage badge and the
  report cannot drift apart the way they just did.
- **Two-wheeler tyres said "Front left" and "Rear left".** The tyre tracker stores a
  two-wheeler's tyres in the left-hand fields rather than adding columns for them, and the
  report read those fields literally. It now asks the vehicle how many wheels it has.

### Distance dropped every kilometre before the first logged record (2026-08-10)

- **Bug:** distance was measured between the highest and lowest *logged* odometer readings in
  the window, and never looked at the vehicle's own `baseline_odometer`. A new scooter sitting
  at 159 km whose first charge was logged at 46 km reported 113 km — and then divided its
  entire energy bill by that short distance, showing 18.8 km/kWh where the app showed 26.5.
- **Fix:** the starting odometer is a reading like any other, dated to when the vehicle was
  added. A window covering a vehicle's whole life now measures from zero and agrees with the
  lifetime figure the rest of the app shows.
- It is deliberately only counted when it falls inside the window. Anchoring on a two-year-old
  baseline would charge a one-month report with every kilometre since the vehicle was bought,
  which is the opposite error. A window narrower than the vehicle's life still measures only
  what happened inside it, and will read lower than the app's lifetime number — correctly.
- The odometer floor moved from `> 0` to `>= 0`, since a brand-new vehicle starts at zero.

### Reports: an EV's own data was missing from its report (2026-08-10)

- **Check-ins now include every charge.** The section listed `vehicle_snapshots` only, so an
  owner who logs charges saw a near-empty table directly below a charging table full of
  odometer readings. Each session already records an odometer and the level charged to, which
  is the same reading a check-in captures, so it now becomes one — labelled "From a charge" to
  keep it distinguishable from a hand-entered row. A session logged as charged-to-full without
  a percentage pins the state at 100, since that is what full means. Flows through the PDF,
  Excel and CSV alike; the type change made the compiler find all three.
- This is the same correction as the battery-health fix one entry down, applied to the surface
  rather than the analytics — the earlier pass fixed the derivation and left the report still
  reading the raw table.
- **The efficiency card was empty on a vehicle whose figures were both known.** Charge
  efficiency came only from state-of-charge segments, and top-ups logged without percentages
  anchor none. It now falls back to distance over energy bought across the window — the same
  ratio `getEvEfficiencyDisplay` falls back to lifetime-wide. Coarser, because energy still in
  the battery counts against distance not yet ridden, but it is the number the rest of the app
  shows and it beats a dash. A measured segment still wins where one exists.
- An empty efficiency card on an electric vehicle no longer calls itself "Fuel efficiency".
- Fixed while verifying the above: a single-vehicle report with no measurable efficiency fell
  through to the spend-by-vehicle pie and drew one slice at 100%. That chart is the
  multi-vehicle stand-in for the efficiency line, not a general fallback.

### Battery health ignored the readings owners actually record (2026-08-10)

- **Bug:** state of health, usable range and days-of-range-left were measured only from manual
  battery check-ins. A charge session already records an odometer and both percentages — the
  charge left on plugging in, the charge reached on unplugging — which is exactly a discharge
  measurement, and logging a charge is the primary EV action while a check-in is an extra
  deliberate one. An owner who logged every charge and never opened the check-in form saw no
  figure at all, despite the app holding everything the measurement needs. Found while
  investigating why an EV's report showed a nearly empty odometer table.
- **Fix:** `toChargeSocObservations` turns each session into the two readings it contains, and
  `collectSocObservations` merges those with check-ins into one ordered history. The existing
  segment builder then works unchanged — a plug-in-to-unplug pair is a rise at a standstill
  and is already rejected as `charged-between`, leaving the real discharge between sessions.
- The ordering detail that makes it correct: the two readings share a date *and* an odometer,
  so the sort's last tiebreak is all that separates them. Plug-in is stamped to sort first;
  reversed, every session would read as a discharge and every ride as a charge.
- App-generated estimated rows are excluded — those are the cold-start guess, not a reading.
- Applied at all three call sites (dashboard, Energy & Battery, copilot analytics) so the
  surfaces cannot disagree, and `getLatestSocSnapshot` now sees charges too, which makes
  "days of range left" reflect the last charge rather than the last manual check-in.

### Reports: the PDF now adapts to what it is describing (2026-08-10)

- **A garage no longer claims one efficiency.** The summary's efficiency card appears only on
  a single-vehicle report — averaging a hatchback against a scooter describes neither. The
  efficiency-over-time line is likewise single-vehicle only; a multi-vehicle report gets a
  spend-by-vehicle pie in its place, because spend is spend whatever the vehicle burns.
- The vehicle pie caps at three hues plus a neutral "Other". That is a measured limit, not a
  taste one: run through the palette validator, a fourth slot drops the orange/yellow pair to
  a normal-vision ΔE of 13.7, under the floor of 15 that no amount of labelling excuses. It
  only folds when at least two vehicles would go into the residual, since folding one tells
  the reader strictly less than showing it.
- **Per-vehicle sections lead with four cards** — type, powertrain, distance, and that
  vehicle's own efficiency — instead of eight fields of mostly-static text. Registration, VIN,
  colour, engine and transmission stay in the Excel and CSV exports, where a wide row is free.
- **The energy table takes its shape from the rows.** A petrol car gets "Fuel" and no
  record-type column repeating "Fuel" on every line; an EV gets "Charging" with no efficiency
  column, which is a full-tank measure with no per-session meaning for a charge; only a
  plug-in hybrid needs both. Efficiency headers now name their unit, and Location is gone —
  it was never being captured.
- **"Odometer readings" was a lie of omission.** It listed only manual check-ins while every
  fill-up and charge carries its own odometer, so an EV owner who logs charges saw a nearly
  empty table and reasonably concluded data was missing. Renamed to "Battery & odometer
  check-ins" and captioned with where the numbers come from.
- **Every em dash in every PDF was rendering as nothing.** Same root cause as the rupee sign —
  the built-in fonts carry WinAnsi and drop what is outside it silently. Since
  `ui.common.emptyValue` is an em dash, *every empty cell in every report so far has been
  blank*. New `toPdfText` substitutes dashes, smart quotes, bullets and ellipses at the point
  of render, so copy stays typographically correct everywhere else.
- Word-splitting turned "Plug-in hybrid" into "Plug-in hy-/brid" in a narrow card; hyphenation
  is now off. And a single-vehicle EV was showing km/kWh under a card labelled "Fuel
  efficiency" — the label follows the figure now.

### Reports: the builder page (2026-08-10)

- `/dashboard/reports` with a new sidebar entry. Coverage (this vehicle / whole garage with
  per-vehicle switches), period (seven presets plus a custom range on the existing `Calendar`),
  which records to include, and the output format.
- **The preview runs the real builder, not an estimate.** The panel calls `buildReportDataset`
  over the store's copy of the data with the same options the request will carry, so the
  counts and the total on screen are the ones the file will contain. An estimate that can
  disagree with the download is worse than no preview.
- Garage selection defaults to null rather than to a list of today's vehicle ids, so a vehicle
  added later is included by default instead of silently missing from the next report.
- Custom dates convert with a local-calendar helper rather than `toISOString`, which would
  hand the server the UTC day and shift an evening selection to the day after.
- `docs/reports.md` documents the module map, the one-dataset rule, the three format-specific
  hazards, and the known limits — custom-tracker costs being out of scope, PostgREST row
  limits on very large garages, pinned number grouping, and one energy type per chart.

### Reports: the export endpoint (2026-08-10)

- `POST /api/reports/export` validates the request with zod, re-reads the vehicles under RLS,
  resolves units the way the user store does, builds the dataset and streams back a PDF, XLSX
  or CSV with a `Content-Disposition` filename.
- **Generation is server-side on purpose.** The PDF and spreadsheet libraries are megabytes
  the browser never needs; the data is re-read from the database rather than trusted from the
  client's store; and a POST body keeps vehicle ids out of URLs and request logs.
- The vehicle query is scoped with `.eq("user_id", user.id)` on top of RLS, so a guessed id
  returns nothing rather than someone else's service history. Ids are validated only as
  plausible keys — ownership is enforced by the query, not by the shape of the string.
- A 500 returns a fixed message and logs the detail. A renderer stack trace says more about
  the server than about the user's report.

### Reports: the PDF document (2026-08-10)

- `report-document.tsx` renders the report with `@react-pdf/renderer` — header, four summary
  stats, the three charts, then a section per vehicle with details, tyres, fuel and charging,
  service history and odometer readings. Reads the same `ReportDataset` as the other two
  writers, so the total on the cover cannot disagree with the tables under it.
- **The rupee sign does not exist in the built-in PDF fonts.** The standard 14 fonts carry
  WinAnsi, which predates U+20B9, so `₹` falls through to .notdef and renders as *nothing* —
  on an India-first app that is every amount in the report silently losing its currency.
  Verified by comparing against a Devanagari glyph Helvetica certainly lacks: the rupee
  behaves like that one, not like the euro. Rather than bundle a typeface for one character,
  unsupported currencies print their ISO code ("INR 4,500.00"), which is what a financial
  document would do anyway. `$`, `£`, `€` and `¥` are drawable and pass through unchanged.
- Number grouping is pinned to one locale rather than the host's. This renders on a server
  whose locale is an accident of deployment, and a report whose separators change between
  environments is a report nobody trusts.
- Chart colours are slots 1–3 of the validated categorical order, checked with the palette
  validator at three slots against a light surface (worst all-pairs CVD ΔE 9.2, normal-vision
  24.0). Aqua sits below 3:1 on white, so it carries the required relief: every series is
  named in a legend with its value, and the same figures appear in the tables below.
- Three things found by rendering the thing and looking at it, rather than by it compiling:
  table columns collided so a row read "14.35Shell, MG Road" (padding on a width-constrained
  `Text` does not inset it — cells are now a box with the text inside); a forced page break
  before *every* vehicle left an almost-empty page after the charts (now only between
  vehicles); and the vehicle subtitle repeated its own heading when there was no nickname.

### Reports: chart geometry (2026-08-10)

- `report-charts.ts` turns the dataset's series into SVG geometry — stacked bars for monthly
  spend, pie arcs for the cost mix, a polyline for efficiency over time — plus nice-rounded
  axis scales and gridlines. Recharts renders to the DOM, so none of the app's charting stack
  works on the server; these are drawn from raw primitives.
- The maths lives in a tested module rather than inline in the renderer because every failure
  mode here is *invisible*: an arc that sweeps a full turn ends where it started and SVG draws
  nothing, so a petrol-only garage would have got a blank circle where its pie should be. That
  case now emits two half-arcs, and a test pins the path.
- Same class of bug covered elsewhere: a flat series has no range to scale against and would
  divide by zero; a single reading makes a polyline that renders nothing, so it is drawn as a
  bare dot; axis labels are built by multiplication rather than repeated addition, which is
  what stops a gridline reading 1.0999999999999999.
- Efficiency points sit at their true position in time, not at even intervals. Three fills in
  one week and a fourth six months later is a fact about the driving, and evenly spacing them
  would hide it.

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
