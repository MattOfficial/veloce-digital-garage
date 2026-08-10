import { NextResponse } from "next/server";
import { z } from "zod";

import { ui } from "@/content/en/ui";
import type { VehicleWithLogs } from "@/types/database";
import {
  getDefaultEvEfficiencyUnit,
  getDefaultFuelEfficiencyUnit,
  isEvEfficiencyUnit,
  resolveFuelVolumeUnit,
} from "@/utils/efficiency-units";
import { renderReportPdf } from "@/components/reports/report-document";
import { buildReportCsv } from "@/utils/reports/report-csv";
import {
  buildReportDataset,
  getEarliestRecordDate,
  getReportVehicleLabel,
  REPORT_SECTIONS,
  REPORT_SCOPES,
  type ReportDistanceUnit,
  type ReportUnits,
} from "@/utils/reports/report-dataset";
import {
  buildReportFilename,
  getReportRangeLabel,
  REPORT_FORMATS,
  REPORT_MIME_TYPES,
} from "@/utils/reports/report-format";
import {
  REPORT_RANGE_PRESETS,
  resolveReportRange,
} from "@/utils/reports/report-range";
import { renderReportWorkbook } from "@/utils/reports/report-xlsx";
import { createClient } from "@/utils/supabase/server";

/**
 * Report generation runs here rather than in the browser for three reasons: the
 * PDF and spreadsheet libraries are megabytes the client never needs, the data
 * is re-read under RLS rather than trusted from the client's store, and a POST
 * body keeps vehicle ids out of URLs and request logs.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  format: z.enum(REPORT_FORMATS),
  scope: z.enum(REPORT_SCOPES),
  // Empty means "everything in the garage". Ownership is enforced by the query,
  // not by the shape of the id, so this only has to be a plausible key.
  vehicleIds: z.array(z.string().min(1).max(64)).max(100).default([]),
  preset: z.enum(REPORT_RANGE_PRESETS),
  from: z.string().max(32).nullish(),
  to: z.string().max(32).nullish(),
  sections: z.array(z.enum(REPORT_SECTIONS)).min(1),
});

const VEHICLE_QUERY = `
  *,
  fuel_logs (*),
  maintenance_logs (*),
  custom_logs (*),
  service_reminders (*),
  vehicle_snapshots (*)
`;

type ProfileRow = {
  currency: string | null;
  distance_unit: string | null;
  ev_efficiency_unit: string | null;
};

/** Mirrors how the user store derives units, so exports match the screen. */
function resolveReportUnits(profile: ProfileRow | null): ReportUnits {
  const distanceUnit: ReportDistanceUnit =
    profile?.distance_unit === "miles" ? "miles" : "km";
  const currency = profile?.currency || "₹";
  const volumeUnit = resolveFuelVolumeUnit(distanceUnit, currency);

  return {
    currency,
    distanceUnit,
    volumeUnit,
    fuelEfficiencyUnit: getDefaultFuelEfficiencyUnit(distanceUnit, volumeUnit),
    evEfficiencyUnit:
      typeof profile?.ev_efficiency_unit === "string" &&
      isEvEfficiencyUnit(profile.ev_efficiency_unit)
        ? profile.ev_efficiency_unit
        : getDefaultEvEfficiencyUnit(distanceUnit),
  };
}

function buildReportTitle(scope: string, vehicles: VehicleWithLogs[]): string {
  return scope === "vehicle" && vehicles.length === 1
    ? getReportVehicleLabel(vehicles[0])
    : ui.profile.garageTitle;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid report request." }, { status: 400 });
  }

  const { format, scope, vehicleIds, preset, from, to, sections } = parsed.data;

  try {
    // Scoped to the signed-in user regardless of the ids asked for, so a
    // guessed id returns nothing rather than someone else's service history.
    let query = supabase.from("vehicles").select(VEHICLE_QUERY).eq("user_id", user.id);
    if (vehicleIds.length > 0) {
      query = query.in("id", vehicleIds);
    }

    const [{ data: vehicleRows, error: vehicleError }, { data: profileRow }] =
      await Promise.all([
        query.order("created_at", { ascending: true }),
        supabase
          .from("users")
          .select("currency, distance_unit, ev_efficiency_unit")
          .eq("id", user.id)
          .single(),
      ]);

    if (vehicleError) {
      console.error("Error loading vehicles for report:", vehicleError);
      return NextResponse.json({ error: "Could not load your vehicles." }, { status: 500 });
    }

    const vehicles = (vehicleRows as unknown as VehicleWithLogs[]) ?? [];
    if (vehicles.length === 0) {
      return NextResponse.json({ error: "No vehicles to report on." }, { status: 404 });
    }

    // `all-time` only knows where to start once the records are in hand.
    const range = resolveReportRange(preset, {
      from,
      to,
      earliest: getEarliestRecordDate(vehicles),
    });

    const dataset = buildReportDataset(vehicles, {
      scope,
      range,
      rangeLabel: getReportRangeLabel(range),
      title: buildReportTitle(scope, vehicles),
      sections,
      units: resolveReportUnits((profileRow as ProfileRow | null) ?? null),
    });

    const filename = buildReportFilename(dataset, format);
    const body =
      format === "csv"
        ? buildReportCsv(dataset)
        : format === "xlsx"
          ? await renderReportWorkbook(dataset)
          : await renderReportPdf(dataset);

    return new Response(body as BodyInit, {
      headers: {
        "Content-Type": REPORT_MIME_TYPES[format],
        // The filename is slugged to [a-z0-9-], so it cannot break the header.
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    // The detail goes to the log, not to the client: a renderer stack trace
    // says more about the server than it does about the user's report.
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Could not generate the report." },
      { status: 500 },
    );
  }
}
