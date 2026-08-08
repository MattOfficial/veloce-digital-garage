"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { FuelDeleteDialog } from "@/components/fuel-delete-dialog";
import { FuelEditModal } from "@/components/fuel-edit-modal";
import { TablePagination } from "@/components/table-pagination";
import { ui } from "@/content/en/ui";
import { useUserStore } from "@/store/user-store";
import type { FuelLog, VehicleWithLogs } from "@/types/database";
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

/** Newest first: the session you just logged should be the one you can see. */
function sortNewestFirst(left: FuelLog, right: FuelLog): number {
  const byDate = new Date(right.date).getTime() - new Date(left.date).getTime();
  if (byDate !== 0) return byDate;

  const byOdometer = right.odometer - left.odometer;
  if (byOdometer !== 0) return byOdometer;

  return (right.created_at ?? "").localeCompare(left.created_at ?? "");
}

function BatteryCell({ log }: { log: FuelLog }) {
  if (log.start_soc != null && log.end_soc != null) {
    return <>{ui.ev.history.socRange(log.start_soc, log.end_soc)}</>;
  }

  if (isFullChargeSession(log)) {
    return <>{ui.ev.history.toFull}</>;
  }

  if (log.start_soc != null) {
    return <>{`${log.start_soc}% →`}</>;
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
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle>{ui.ev.history.title}</CardTitle>
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
                <thead className="border-b bg-muted/10 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      {ui.ev.history.columns.date}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {ui.ev.history.columns.where}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {ui.ev.history.columns.billed}
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      {ui.ev.history.columns.energy}
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      {ui.ev.history.columns.cost}
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      {ui.ev.history.columns.rate}
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      {ui.ev.history.columns.battery}
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      {ui.ev.history.columns.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visibleLogs.map((log) => {
                    const effectiveRate =
                      log.fuel_volume > 0 ? log.total_cost / log.fuel_volume : null;

                    return (
                      <tr key={log.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-6 py-4 font-medium">
                          {formatTableDate(log.date)}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {formatNumber(log.odometer)} {profile.distanceUnit}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300">
                            {ui.ev.mix.sources[log.charge_source ?? "other"]}
                          </span>
                          {log.charger_network ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {log.charger_network}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">
                          {log.pricing_mode
                            ? ui.ev.chargeModal.pricingModes[log.pricing_mode]
                            : ui.common.emptyValue}
                          {log.duration_minutes != null ? (
                            <span className="ml-1">
                              · {formatNumber(log.duration_minutes)} min
                            </span>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {log.fuel_volume.toFixed(2)}{" "}
                          <span className="text-xs text-muted-foreground">kWh</span>
                          {/* A derived figure is not a meter reading, and the
                              table is where that distinction is easiest to lose. */}
                          {log.energy_basis === "soc_derived" ? (
                            <p
                              className="text-xs text-muted-foreground"
                              title={ui.ev.history.derivedEnergy}
                            >
                              ≈
                            </p>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-rose-600 dark:text-rose-400">
                          {formatMoneyExact(log.total_cost, profile.currency)}
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground">
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
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={ui.common.actions.edit}
                              className="h-8 w-8 rounded-lg text-muted-foreground/40 transition-colors hover:bg-primary/10 hover:text-primary"
                              onClick={() => setEditingLog(log)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={ui.common.actions.delete}
                              className="h-8 w-8 rounded-lg text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
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
