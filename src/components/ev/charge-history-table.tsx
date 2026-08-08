"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2, Zap } from "lucide-react";

import { FuelDeleteDialog } from "@/components/fuel-delete-dialog";
import { FuelEditModal } from "@/components/fuel-edit-modal";
import { TablePagination } from "@/components/table-pagination";
import { Pill, PillDot, type PillTone } from "@/components/ui/pill";
import { ui } from "@/content/en/ui";
import { useUserStore } from "@/store/user-store";
import type {
  ChargePricingMode,
  ChargeSource,
  FuelLog,
  VehicleWithLogs,
} from "@/types/database";
import { isFullChargeSession } from "@/utils/charge-session";
import {
  formatMoney,
  formatMoneyExact,
  formatNumber,
  formatTableDate,
} from "@/utils/formatting";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@mattofficial/veloce-ui";

/**
 * Colour by where the energy came from: home is the cheap routine one, DC fast
 * the expensive exception, so they should not look alike in a list.
 */
const SOURCE_TONES: Record<ChargeSource, PillTone> = {
  home: "violet",
  ac_public: "cyan",
  dc_fast: "orange",
  other: "neutral",
};

/**
 * How the session was billed, in tones that do not collide with the source
 * column beside it — otherwise two pills of the same colour in one row imply a
 * relationship that is not there.
 */
const PRICING_TONES: Record<ChargePricingMode, PillTone> = {
  per_kwh: "blue",
  per_minute: "amber",
  flat: "rose",
  free: "emerald",
};

/** Newest first: the session you just logged should be the one you can see. */
function sortNewestFirst(left: FuelLog, right: FuelLog): number {
  const byDate = new Date(right.date).getTime() - new Date(left.date).getTime();
  if (byDate !== 0) return byDate;

  const byOdometer = right.odometer - left.odometer;
  if (byOdometer !== 0) return byOdometer;

  return (right.created_at ?? "").localeCompare(left.created_at ?? "");
}

function BatteryCell({ log }: { log: FuelLog }) {
  // A session that reached full is the one that measures pack capacity, so it
  // is worth being able to spot down the column.
  const reachedFull = isFullChargeSession(log);

  if (log.start_soc != null && log.end_soc != null) {
    return (
      <Pill tone={reachedFull ? "emerald" : "neutral"} className="tabular-nums">
        {ui.ev.history.socRange(log.start_soc, log.end_soc)}
      </Pill>
    );
  }

  if (reachedFull) {
    return <Pill tone="emerald">{ui.ev.history.toFull}</Pill>;
  }

  if (log.start_soc != null) {
    return (
      <Pill tone="neutral" className="tabular-nums">{`${log.start_soc}% →`}</Pill>
    );
  }

  return <span className="text-muted-foreground">{ui.common.emptyValue}</span>;
}

export function ChargeHistoryTable({ vehicle }: { vehicle: VehicleWithLogs }) {
  const { profile } = useUserStore();
  const [editingLog, setEditingLog] = useState<FuelLog | null>(null);
  const [deletingLog, setDeletingLog] = useState<FuelLog | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const logs = useMemo(
    () =>
      (vehicle.fuel_logs ?? [])
        .filter((log) => log.energy_type === "charge")
        .sort(sortNewestFirst),
    [vehicle.fuel_logs],
  );

  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleLogs = useMemo(
    () => logs.slice((safePage - 1) * pageSize, safePage * pageSize),
    [logs, pageSize, safePage],
  );

  return (
    <>
      <Card className="overflow-hidden rounded-[2rem] border shadow-sm">
        <CardHeader className="border-b bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent pb-4">
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Zap className="h-4 w-4" />
            </span>
            {ui.ev.history.title}
          </CardTitle>
          <CardDescription>{ui.ev.history.description}</CardDescription>
        </CardHeader>

        {logs.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {ui.ev.history.empty}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gradient-to-r from-muted/40 via-muted/20 to-transparent text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      {ui.ev.history.columns.date}
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      {ui.ev.history.columns.where}
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      {ui.ev.history.columns.billed}
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      {ui.ev.history.columns.energy}
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      {ui.ev.history.columns.cost}
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      {ui.ev.history.columns.rate}
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      {ui.ev.history.columns.battery}
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      {ui.ev.history.columns.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {visibleLogs.map((log) => {
                    const effectiveRate =
                      log.fuel_volume > 0 ? log.total_cost / log.fuel_volume : null;

                    const source = log.charge_source ?? "other";
                    const isFree = log.total_cost === 0;

                    return (
                      <tr
                        key={log.id}
                        className="group transition-colors even:bg-muted/[0.12] hover:bg-primary/[0.05] dark:even:bg-white/[0.02]"
                      >
                        <td className="relative px-6 py-4 font-medium tabular-nums">
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 transition-opacity group-hover:opacity-100"
                          />
                          {formatTableDate(log.date)}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {formatNumber(log.odometer)} {profile.distanceUnit}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Pill tone={SOURCE_TONES[source]}>
                            <PillDot />
                            {ui.ev.mix.sources[source]}
                          </Pill>
                          {log.charger_network ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {log.charger_network}
                            </p>
                          ) : null}
                        </td>
                        {/* This column was plain text while the equivalent
                            column on the petrol table was a pill, which is what
                            made the EV rows look washed out beside it. */}
                        <td className="px-6 py-4">
                          {log.pricing_mode ? (
                            <Pill tone={PRICING_TONES[log.pricing_mode]}>
                              {ui.ev.chargeModal.pricingModes[log.pricing_mode]}
                            </Pill>
                          ) : (
                            <span className="text-muted-foreground">
                              {ui.common.emptyValue}
                            </span>
                          )}
                          {log.duration_minutes != null ? (
                            <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                              {formatNumber(log.duration_minutes)} min
                            </p>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums">
                          <span className="font-medium">
                            {log.fuel_volume.toFixed(2)}
                          </span>{" "}
                          <span className="text-xs text-muted-foreground">kWh</span>
                          {/* A derived figure is not a meter reading, and the
                              table is where that distinction is easiest to lose. */}
                          {log.energy_basis === "soc_derived" ? (
                            <span
                              className="ml-1 cursor-help text-xs text-amber-600 dark:text-amber-400"
                              title={ui.ev.history.derivedEnergy}
                            >
                              ≈
                            </span>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isFree ? (
                            <Pill tone="emerald">{ui.ev.history.free}</Pill>
                          ) : (
                            <span className="font-semibold tabular-nums text-rose-700 dark:text-rose-300">
                              {formatMoneyExact(log.total_cost, profile.currency)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums text-muted-foreground">
                          {effectiveRate != null
                            ? formatMoney(effectiveRate, profile.currency, {
                                maximumFractionDigits: 2,
                              })
                            : ui.common.emptyValue}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <BatteryCell log={log} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={ui.common.actions.edit}
                              className="h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                              onClick={() => setEditingLog(log)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={ui.common.actions.delete}
                              className="h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setDeletingLog(log)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <TablePagination
              page={safePage}
              pageSize={pageSize}
              totalItems={logs.length}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </Card>

      {editingLog && (
        <FuelEditModal
          log={editingLog}
          vehicle={vehicle}
          open
          onOpenChange={(open) => {
            if (!open) setEditingLog(null);
          }}
        />
      )}

      {deletingLog && (
        <FuelDeleteDialog
          logId={deletingLog.id}
          vehicleId={deletingLog.vehicle_id}
          logDate={formatTableDate(deletingLog.date)}
          open
          onOpenChange={(open) => {
            if (!open) setDeletingLog(null);
          }}
        />
      )}
    </>
  );
}
