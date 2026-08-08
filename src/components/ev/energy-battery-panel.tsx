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
  Gauge,
  HeartPulse,
  PiggyBank,
  Plug,
  Zap,
} from "lucide-react";

import { BatteryCheckInModal } from "@/components/battery-check-in-modal";
import { FuelLogModal } from "@/components/fuel-log-modal";
import { MotionWrapper } from "@/components/motion-wrapper";
import { ui } from "@/content/en/ui";
import { useUserStore } from "@/store/user-store";
import type { VehicleWithLogs } from "@/types/database";
import {
  estimateDaysOfRangeLeft,
  getLatestSocSnapshot,
  summarizeBatteryHealth,
} from "@/utils/battery-health";
import { convertEvEfficiency, getEvEfficiencyPrecision } from "@/utils/efficiency-units";
import { buildEvEnergySummary } from "@/utils/ev-energy-analytics";
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
  icon,
}: {
  label: string;
  value: string;
  hint?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/40 p-4 dark:border-white/5 dark:bg-white/5">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function EstimateBadge() {
  return (
    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">
      {ui.ev.energy.estimateBadge}
    </span>
  );
}

export function EnergyBatteryPanel({ vehicle }: { vehicle: VehicleWithLogs }) {
  const { profile, getEvEfficiencyUnit } = useUserStore();
  const distanceUnit = profile.distanceUnit;
  const efficiencyUnit = getEvEfficiencyUnit();

  const health = useMemo(
    () =>
      summarizeBatteryHealth(vehicle.vehicle_snapshots ?? [], {
        // The rated pack is a fallback: usable capacity is the correct
        // denominator but is not always known.
        usableBatteryKwh: vehicle.usable_battery_kwh ?? vehicle.battery_capacity_kwh,
        baselineRangeKm: vehicle.baseline_range_km,
      }),
    [
      vehicle.baseline_range_km,
      vehicle.battery_capacity_kwh,
      vehicle.usable_battery_kwh,
      vehicle.vehicle_snapshots,
    ],
  );

  const energy = useMemo(
    () =>
      buildEvEnergySummary(vehicle, {
        whPerKm: health.whPerKm,
        usableBatteryKwh: vehicle.usable_battery_kwh ?? vehicle.battery_capacity_kwh,
        tariffPerKwh: profile.electricityTariffPerKwh,
        petrolPricePerUnit: profile.petrolPriceReference,
        iceReferenceEfficiency: profile.iceReferenceEfficiency,
        periodDays: PERIOD_DAYS,
      }),
    [
      health.whPerKm,
      profile.electricityTariffPerKwh,
      profile.iceReferenceEfficiency,
      profile.petrolPriceReference,
      vehicle,
    ],
  );

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

  const displayedEfficiency =
    health.whPerKm != null
      ? convertEvEfficiency(1, health.whPerKm / 1000, efficiencyUnit, distanceUnit)
      : null;

  const trendData = health.trend.filter((point) => point.usableRangeKm != null);
  const hasHealthData = health.usableRangeKm != null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <BatteryCheckInModal vehicle={vehicle} />
        <FuelLogModal vehicle={vehicle} />
      </div>

      {/* Battery health is the hero: it is the metric an EV owner actually
          worries about, and the one mileage-style thinking never surfaces. */}
      <MotionWrapper>
        <Card className="rounded-[2rem]">
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
            {!hasHealthData ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center dark:border-white/10">
                <BatteryWarning className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 font-semibold">{ui.ev.health.emptyTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {ui.ev.health.emptyDescription}
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatTile
                    label={ui.ev.health.stateOfHealth}
                    value={
                      health.stateOfHealthPercent != null
                        ? `${health.stateOfHealthPercent.toFixed(1)}%`
                        : ui.vehicle.emptyValue
                    }
                    hint={ui.ev.health.baselineSource[health.baselineSource]}
                  />
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
                    label={ui.ev.health.degradationPerYear}
                    value={
                      health.degradationPercentPerYear != null
                        ? `${health.degradationPercentPerYear.toFixed(1)}%`
                        : ui.vehicle.emptyValue
                    }
                  />
                  <StatTile
                    label={ui.ev.health.yearsToThreshold(health.sohThresholdPercent)}
                    value={
                      health.yearsToSohThreshold != null
                        ? health.yearsToSohThreshold.toFixed(1)
                        : ui.vehicle.emptyValue
                    }
                  />
                </div>

                {trendData.length > 1 ? (
                  <div className="h-56 w-full">
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
              </>
            )}
          </CardContent>
        </Card>
      </MotionWrapper>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Efficiency measured against energy actually paid for, which is a
            different number from the pack-level figure above: the meter bills
            for charging losses too. */}
        <MotionWrapper>
          <Card className="h-full rounded-[2rem]">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Gauge className="h-5 w-5 text-primary" />
                    {ui.ev.efficiency.title}
                  </CardTitle>
                  <CardDescription>{ui.ev.efficiency.description}</CardDescription>
                </div>
                <p className="text-right text-xs text-muted-foreground">
                  {ui.ev.efficiency.segmentsUsed(energy.efficiency.usableSegmentCount)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {energy.efficiency.distancePerKwh != null ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <StatTile
                      label={ui.ev.efficiency.perKwh(distanceUnit)}
                      value={energy.efficiency.distancePerKwh.toFixed(1)}
                      hint={
                        energy.efficiency.method != null
                          ? ui.ev.efficiency.method[energy.efficiency.method]
                          : ui.ev.efficiency.methodMixed
                      }
                    />
                    <StatTile
                      label={ui.ev.efficiency.costPerDistance(distanceUnit)}
                      value={
                        energy.efficiency.costPerDistance != null
                          ? formatMoney(
                              energy.efficiency.costPerDistance,
                              profile.currency,
                              { maximumFractionDigits: 2 },
                            )
                          : ui.vehicle.emptyValue
                      }
                      hint={ui.ev.health.confidence[energy.efficiency.confidence]}
                    />
                  </div>

                  {energy.efficiency.unanchoredSessionCount > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {ui.ev.efficiency.unanchored(
                        energy.efficiency.unanchoredSessionCount,
                      )}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {ui.ev.efficiency.empty}
                </p>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper>
          <Card className="h-full rounded-[2rem]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-primary" />
                {ui.ev.energy.title}
              </CardTitle>
              <CardDescription>
                {ui.ev.energy.basis[energy.period.basis]}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <StatTile
                  label={ui.ev.energy.efficiency}
                  value={
                    displayedEfficiency != null
                      ? `${displayedEfficiency.toFixed(getEvEfficiencyPrecision(efficiencyUnit))} ${efficiencyUnit}`
                      : ui.vehicle.emptyValue
                  }
                />
                <StatTile
                  label={ui.ev.energy.costPerDistance(distanceUnit)}
                  value={
                    energy.period.costPerDistance != null
                      ? formatMoney(energy.period.costPerDistance, profile.currency, {
                          maximumFractionDigits: 2,
                        })
                      : ui.vehicle.emptyValue
                  }
                  hint={ui.ev.energy.monthlyCost}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    {ui.ev.energy.inferredHome}
                    {energy.period.inferredEnergyKwh != null ? (
                      <EstimateBadge />
                    ) : null}
                  </span>
                  <span className="font-medium">
                    {energy.period.inferredEnergyKwh != null
                      ? `${energy.period.inferredEnergyKwh.toFixed(1)} kWh${
                          energy.period.inferredCost != null
                            ? ` · ${formatMoney(energy.period.inferredCost, profile.currency)}`
                            : ""
                        }`
                      : ui.vehicle.emptyValue}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    {ui.ev.energy.loggedPublic}
                  </span>
                  <span className="font-medium">
                    {`${energy.period.loggedEnergyKwh.toFixed(1)} kWh · ${formatMoney(energy.period.loggedCost, profile.currency)}`}
                  </span>
                </div>
              </div>

              {health.whPerKm == null ? (
                <p className="text-xs text-muted-foreground">
                  {ui.ev.energy.missingEfficiency}
                </p>
              ) : profile.electricityTariffPerKwh == null ? (
                <p className="text-xs text-muted-foreground">
                  {ui.ev.energy.missingTariff}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper>
          <Card className="h-full rounded-[2rem]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PiggyBank className="h-5 w-5 text-primary" />
                {ui.ev.savings.title}
              </CardTitle>
              <CardDescription>{ui.ev.savings.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {energy.savings.savings != null ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <StatTile
                    label={ui.ev.savings.saved}
                    value={formatMoney(energy.savings.savings, profile.currency)}
                    hint={ui.ev.energy.monthlyCost}
                  />
                  <StatTile
                    label={ui.ev.savings.equivalentCost}
                    value={formatMoney(
                      energy.savings.equivalentIceCost as number,
                      profile.currency,
                    )}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {ui.ev.savings.missingReference}
                </p>
              )}

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
            </CardContent>
          </Card>
        </MotionWrapper>

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
              {energy.mix.totalEnergyKwh > 0 ? (
                <div className="space-y-3">
                  {energy.mix.entries
                    .filter((entry) => entry.energyKwh > 0)
                    .map((entry) => (
                      <div key={entry.source} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            {ui.ev.mix.sources[entry.source]}
                            {entry.isEstimated ? <EstimateBadge /> : null}
                          </span>
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
              ) : (
                <p className="text-sm text-muted-foreground">{ui.ev.mix.empty}</p>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>

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
                value={
                  energy.care.score != null
                    ? energy.care.score.toFixed(0)
                    : ui.vehicle.emptyValue
                }
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
                      : ui.vehicle.emptyValue}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* The one payoff for charging all the way to full. Efficiency never
            needs it; sizing the pack does. */}
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
              {energy.capacity.latestApparentKwh != null ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <StatTile
                      label={ui.ev.capacity.latest}
                      value={`${energy.capacity.latestApparentKwh.toFixed(2)} kWh`}
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
                          : ui.vehicle.emptyValue
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ui.ev.capacity.lossNote}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {ui.ev.capacity.empty}
                </p>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>
    </div>
  );
}
