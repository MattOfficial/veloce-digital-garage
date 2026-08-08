"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BatteryCharging,
  BatteryWarning,
  HeartPulse,
  Lightbulb,
  Plug,
} from "lucide-react";

import { BatteryCheckInModal } from "@/components/battery-check-in-modal";
import { ChargeHistoryTable } from "@/components/ev/charge-history-table";
import { FuelLogModal } from "@/components/fuel-log-modal";
import { MotionWrapper } from "@/components/motion-wrapper";
import { ui } from "@/content/en/ui";
import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import type { VehicleWithLogs } from "@/types/database";
import {
  estimateDaysOfRangeLeft,
  getLatestSocSnapshot,
  summarizeBatteryHealth,
} from "@/utils/battery-health";
import { convertEvEfficiency, getEvEfficiencyPrecision } from "@/utils/efficiency-units";
import { buildEvEnergySummary } from "@/utils/ev-energy-analytics";
import { buildEvSavings } from "@/utils/ev-savings";
import { formatMoney } from "@/utils/formatting";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mattofficial/veloce-ui";

const PERIOD_DAYS = 30;

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/40 p-4 dark:border-white/5 dark:bg-white/5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/**
 * The Energy & Battery page.
 *
 * Ordered by what an owner can actually see today rather than by what the
 * analytics can theoretically produce. Four headline numbers and the charge
 * history come first, because those work from a single logged session. Battery
 * health, pack capacity, charging mix and care all need data most owners will
 * not have on day one, so they appear only once they have something to say —
 * an empty card in a prominent position is worse than no card, because it reads
 * as a broken feature rather than a future one.
 */
export function EnergyBatteryPanel({ vehicle }: { vehicle: VehicleWithLogs }) {
  const { profile, getEvEfficiencyUnit } = useUserStore();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const distanceUnit = profile.distanceUnit;
  const efficiencyUnit = getEvEfficiencyUnit();
  const usableBatteryKwh =
    vehicle.usable_battery_kwh ?? vehicle.battery_capacity_kwh;

  const health = useMemo(
    () =>
      summarizeBatteryHealth(vehicle.vehicle_snapshots ?? [], {
        // The rated pack is a fallback: usable capacity is the correct
        // denominator but is not always known.
        usableBatteryKwh,
        baselineRangeKm: vehicle.baseline_range_km,
      }),
    [usableBatteryKwh, vehicle.baseline_range_km, vehicle.vehicle_snapshots],
  );

  const energy = useMemo(
    () =>
      buildEvEnergySummary(vehicle, {
        whPerKm: health.whPerKm,
        usableBatteryKwh,
        tariffPerKwh: profile.electricityTariffPerKwh,
        periodDays: PERIOD_DAYS,
      }),
    [health.whPerKm, profile.electricityTariffPerKwh, usableBatteryKwh, vehicle],
  );

  // Compared against the owner's own petrol vehicles of the same class where
  // possible; a published average is the last resort, not the first.
  const savings = useMemo(
    () =>
      buildEvSavings(vehicle, vehicles, {
        petrolPricePerUnit: profile.petrolPriceReference,
        iceReferenceEfficiency: profile.iceReferenceEfficiency,
        currency: profile.currency,
      }),
    [
      profile.currency,
      profile.iceReferenceEfficiency,
      profile.petrolPriceReference,
      vehicle,
      vehicles,
    ],
  );

  const vehicleTypeLabel = ui.ev.savings.vehicleTypes[savings.benchmark.vehicleType];
  const benchmarkNote =
    savings.benchmark.source === "garage"
      ? ui.ev.savings.benchmark.garage(savings.benchmark.vehicleCount, vehicleTypeLabel)
      : savings.benchmark.source === "regional-default"
        ? ui.ev.savings.benchmark["regional-default"](vehicleTypeLabel)
        : savings.benchmark.source === "profile-reference"
          ? ui.ev.savings.benchmark["profile-reference"]
          : ui.ev.savings.benchmark.unavailable;

  // Efficiency is what the meter bought, not what the pack drew. It used to be
  // read off battery health, which meant it stayed blank for anyone who logged
  // charges but never recorded a state-of-charge check-in.
  const displayedEfficiency =
    energy.efficiency.distancePerKwh != null
      ? convertEvEfficiency(
          energy.efficiency.distancePerKwh,
          1,
          efficiencyUnit,
          distanceUnit,
        )
      : null;

  const efficiencyHint =
    energy.efficiency.basis === "lifetime"
      ? ui.ev.overview.lifetime
      : energy.efficiency.method != null
        ? ui.ev.efficiency.method[energy.efficiency.method]
        : energy.efficiency.basis === "segments"
          ? ui.ev.efficiency.methodMixed
          : null;

  const latestSnapshot = getLatestSocSnapshot(vehicle.vehicle_snapshots ?? []);
  const averageDailyDistance =
    energy.period.distance != null && energy.period.distance > 0
      ? energy.period.distance / PERIOD_DAYS
      : null;
  const daysOfRangeLeft = estimateDaysOfRangeLeft(
    latestSnapshot?.soc_percent ?? null,
    health.kmPerPercent,
    averageDailyDistance,
  );

  const trendData = health.trend.filter((point) => point.usableRangeKm != null);
  // A free session carries no energy and no cost but is still a session, so the
  // headline row should appear rather than the empty state.
  const hasSessions = (vehicle.fuel_logs ?? []).some(
    (log) => log.energy_type === "charge",
  );

  // Each of these renders only when it can say something true.
  const showHealth = health.usableRangeKm != null;
  const showCapacity = energy.capacity.latestApparentKwh != null;
  const showMix =
    energy.mix.entries.filter((entry) => entry.energyKwh > 0).length > 1;
  const showCare = energy.care.score != null;

  const lockedHints: string[] = [
    showHealth ? null : ui.ev.more.health,
    showCapacity ? null : ui.ev.more.capacity,
    showMix ? null : ui.ev.more.mix,
    showCare ? null : ui.ev.more.care,
  ].filter((hint) => hint != null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <BatteryCheckInModal vehicle={vehicle} />
        <FuelLogModal vehicle={vehicle} />
      </div>

      {!hasSessions ? (
        <MotionWrapper>
          <Card className="rounded-[2rem] border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Plug className="mb-4 h-10 w-10 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold tracking-tight">
                {ui.ev.overview.emptyTitle}
              </h3>
              <p className="mt-2 max-w-sm text-muted-foreground">
                {ui.ev.overview.emptyDescription}
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>
      ) : (
        <MotionWrapper>
          <div className="space-y-3">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label={`${ui.ev.overview.efficiency} (${efficiencyUnit})`}
                value={
                  displayedEfficiency != null
                    ? displayedEfficiency.toFixed(
                        getEvEfficiencyPrecision(efficiencyUnit),
                      )
                    : ui.common.emptyValue
                }
                hint={efficiencyHint}
              />
              <StatTile
                label={ui.ev.overview.costPerDistance(distanceUnit)}
                value={
                  energy.efficiency.costPerDistance != null
                    ? formatMoney(
                        energy.efficiency.costPerDistance,
                        profile.currency,
                        { maximumFractionDigits: 2 },
                      )
                    : ui.common.emptyValue
                }
                hint={ui.ev.overview.lifetime}
              />
              <StatTile
                label={ui.ev.overview.saved}
                value={
                  savings.savings != null
                    ? formatMoney(savings.savings, profile.currency)
                    : ui.common.emptyValue
                }
                hint={benchmarkNote}
              />
              <StatTile
                label={ui.ev.overview.totalCharged}
                value={formatMoney(
                  energy.efficiency.lifetimeCost,
                  profile.currency,
                )}
                hint={`${energy.efficiency.lifetimeEnergyKwh.toFixed(1)} kWh`}
              />
            </div>

            {/* Only measurable when a session recorded both a meter reading and
                a state of charge, and the only thing that explains a per-kWh
                figure disagreeing with the vehicle's own display. */}
            {energy.chargingLoss != null ? (
              <p className="text-xs text-muted-foreground">
                {ui.ev.overview.chargingLoss(
                  `${(energy.chargingLoss * 100).toFixed(0)}%`,
                )}
              </p>
            ) : null}

            {energy.efficiency.unanchoredSessionCount > 0 ? (
              <p className="text-xs text-muted-foreground">
                {ui.ev.efficiency.unanchored(
                  energy.efficiency.unanchoredSessionCount,
                )}
              </p>
            ) : null}
          </div>
        </MotionWrapper>
      )}

      <MotionWrapper>
        <ChargeHistoryTable vehicle={vehicle} />
      </MotionWrapper>

      {(showHealth || showCapacity || showMix || showCare) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {showHealth && (
            <MotionWrapper>
              <Card className="h-full rounded-[2rem]">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <HeartPulse className="h-5 w-5 text-primary" />
                        {ui.ev.health.title}
                      </CardTitle>
                      <CardDescription>{ui.ev.health.description}</CardDescription>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>
                        {ui.ev.health.confidenceLabel}:{" "}
                        <span className="font-semibold text-foreground">
                          {ui.ev.health.confidence[health.confidence]}
                        </span>
                      </p>
                      <p>{ui.ev.health.segmentsUsed(health.usableSegmentCount)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <StatTile
                      label={ui.ev.health.usableRange(distanceUnit)}
                      value={(health.usableRangeKm as number).toFixed(0)}
                      hint={
                        health.kmPerPercent != null
                          ? `${health.kmPerPercent.toFixed(2)} ${ui.ev.health.perPercent(distanceUnit)}`
                          : null
                      }
                    />
                    <StatTile
                      label={ui.ev.health.stateOfHealth}
                      value={
                        health.stateOfHealthPercent != null
                          ? `${health.stateOfHealthPercent.toFixed(1)}%`
                          : ui.common.emptyValue
                      }
                      hint={ui.ev.health.baselineSource[health.baselineSource]}
                    />
                  </div>

                  <div className="rounded-2xl border border-border bg-secondary/40 p-4 dark:border-white/5 dark:bg-white/5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {ui.ev.rangeLeft.title}
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {daysOfRangeLeft != null
                        ? ui.ev.rangeLeft.daysRemaining(daysOfRangeLeft)
                        : ui.ev.rangeLeft.unavailable}
                    </p>
                    {latestSnapshot?.soc_percent != null ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {ui.ev.rangeLeft.atSoc(latestSnapshot.soc_percent)}
                      </p>
                    ) : null}
                  </div>

                  {trendData.length > 1 ? (
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-border"
                          />
                          <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            className="text-xs"
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            className="text-xs"
                            domain={["dataMin - 5", "dataMax + 5"]}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "1rem",
                              border: "1px solid var(--border)",
                              background: "var(--card)",
                            }}
                            formatter={(value: number) => [
                              `${value.toFixed(0)} ${distanceUnit}`,
                              ui.ev.health.trendTitle,
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="usableRangeKm"
                            stroke="var(--primary)"
                            fill="var(--primary)"
                            fillOpacity={0.15}
                            strokeWidth={2}
                            connectNulls
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </MotionWrapper>
          )}

          {showCapacity && (
            <MotionWrapper>
              <Card className="h-full rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BatteryWarning className="h-5 w-5 text-primary" />
                    {ui.ev.capacity.title}
                  </CardTitle>
                  <CardDescription>{ui.ev.capacity.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <StatTile
                      label={ui.ev.capacity.latest}
                      value={`${(energy.capacity.latestApparentKwh as number).toFixed(2)} kWh`}
                      hint={
                        energy.capacity.baselineApparentKwh != null
                          ? `${ui.ev.capacity.baseline}: ${energy.capacity.baselineApparentKwh.toFixed(2)} kWh`
                          : null
                      }
                    />
                    <StatTile
                      label={ui.ev.capacity.stateOfHealth}
                      value={
                        energy.capacity.stateOfHealthPercent != null
                          ? `${energy.capacity.stateOfHealthPercent.toFixed(1)}%`
                          : ui.common.emptyValue
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ui.ev.capacity.lossNote}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>
          )}

          {showMix && (
            <MotionWrapper>
              <Card className="h-full rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Plug className="h-5 w-5 text-primary" />
                    {ui.ev.mix.title}
                  </CardTitle>
                  <CardDescription>{ui.ev.mix.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {energy.mix.entries
                      .filter((entry) => entry.energyKwh > 0)
                      .map((entry) => (
                        <div key={entry.source} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{ui.ev.mix.sources[entry.source]}</span>
                            <span className="font-medium">
                              {`${(entry.share * 100).toFixed(0)}% · ${entry.energyKwh.toFixed(1)} kWh`}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary dark:bg-white/10">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.min(100, entry.share * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </MotionWrapper>
          )}

          {showCare && (
            <MotionWrapper>
              <Card className="h-full rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BatteryCharging className="h-5 w-5 text-primary" />
                    {ui.ev.care.title}
                  </CardTitle>
                  <CardDescription>{ui.ev.care.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StatTile
                    label={ui.ev.care.score}
                    value={(energy.care.score as number).toFixed(0)}
                    hint={ui.ev.care.bands[energy.care.band]}
                  />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {ui.ev.care.deepDischarges}
                      </span>
                      <span className="font-medium">
                        {energy.care.deepDischargeCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {ui.ev.care.fullCharges}
                      </span>
                      <span className="font-medium">{energy.care.fullChargeCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {ui.ev.care.dcFastShare}
                      </span>
                      <span className="font-medium">
                        {energy.care.dcFastShare != null
                          ? `${(energy.care.dcFastShare * 100).toFixed(0)}%`
                          : ui.common.emptyValue}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionWrapper>
          )}
        </div>
      )}

      {/* One quiet line at the bottom rather than four empty cards at the top.
          It says what each metric needs, so they read as achievable. */}
      {lockedHints.length > 0 && (
        <MotionWrapper>
          <Card className="rounded-[2rem] border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Lightbulb className="h-4 w-4" />
                {ui.ev.more.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {lockedHints.map((hint) => (
                  <li key={hint} className="flex gap-2">
                    <span aria-hidden="true" className="text-muted-foreground/50">
                      ·
                    </span>
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </MotionWrapper>
      )}
    </div>
  );
}
