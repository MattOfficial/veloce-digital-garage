import { buildFuelAnalytics } from "@/utils/fuel-analytics";
import { getGarageDistanceSummary } from "@/utils/distance-analytics";
import type {
    CopilotAnalyticsQuery,
    CopilotAnalyticsResult,
} from "@/types/ai";
import type { VehicleWithLogs } from "@/types/database";
import { getVehicleCurrentOdometer } from "@/utils/vehicle-metrics";

type AnalyticsProfile = {
    currency: string;
    distanceUnit: "km" | "miles";
};

function formatNumber(value: number, fractionDigits = 2) {
    return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(value);
}

function formatCurrency(value: number, currency: string) {
    return `${currency}${formatNumber(value)}`;
}

function getScopedVehicles(query: CopilotAnalyticsQuery, vehicles: VehicleWithLogs[]) {
    if (query.scope === "garage") {
        return vehicles;
    }

    return vehicles.filter((vehicle) => query.vehicleIds.includes(vehicle.id));
}

function getVehicleLabel(vehicles: VehicleWithLogs[]) {
    if (vehicles.length === 1) {
        const vehicle = vehicles[0];
        return vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    }

    return "your garage";
}

function getCurrentOdometer(vehicle: VehicleWithLogs, endDate?: string) {
    if (!endDate) {
        return getVehicleCurrentOdometer(vehicle);
    }

    const logs = [...(vehicle.fuel_logs ?? [])]
        .filter((log) => log.date <= endDate)
        .sort((left, right) => right.odometer - left.odometer);

    return logs[0]?.odometer ?? vehicle.current_odometer ?? vehicle.baseline_odometer;
}

function filterLogsByDate<T extends { date: string }>(logs: T[], start: string, end: string) {
    return logs.filter((log) => log.date >= start && log.date <= end);
}

function getDistanceResult(query: CopilotAnalyticsQuery, vehicles: VehicleWithLogs[], profile: AnalyticsProfile): CopilotAnalyticsResult {
    const summary = getGarageDistanceSummary(vehicles, {
        start: query.dateRange.start,
        end: query.dateRange.end,
    });
    const vehicleLabel = getVehicleLabel(vehicles);

    if (!summary.hasSufficientData || summary.value == null) {
        return {
            metric: query.metric,
            scope: query.scope,
            vehicleIds: vehicles.map((vehicle) => vehicle.id),
            value: null,
            unit: profile.distanceUnit,
            label: "Distance driven",
            summary: `I don’t have enough odometer history to calculate distance for ${vehicleLabel} during ${query.dateRange.label}.`,
            dateRangeLabel: query.dateRange.label,
            hasSufficientData: false,
        };
    }

    const coverageNote = summary.coverage === "partial"
        ? " based on the odometer logs currently available."
        : ".";

    return {
        metric: query.metric,
        scope: query.scope,
        vehicleIds: vehicles.map((vehicle) => vehicle.id),
        value: summary.value,
        unit: profile.distanceUnit,
        label: "Distance driven",
        summary: `You drove ${formatNumber(summary.value)} ${profile.distanceUnit} across ${vehicleLabel} during ${query.dateRange.label}${coverageNote}`,
        dateRangeLabel: query.dateRange.label,
        hasSufficientData: true,
    };
}

function getSpendResult(
    query: CopilotAnalyticsQuery,
    vehicles: VehicleWithLogs[],
    profile: AnalyticsProfile,
): CopilotAnalyticsResult {
    let total = 0;

    for (const vehicle of vehicles) {
        const fuelLogs = filterLogsByDate(vehicle.fuel_logs ?? [], query.dateRange.start, query.dateRange.end);
        const maintenanceLogs = filterLogsByDate(vehicle.maintenance_logs ?? [], query.dateRange.start, query.dateRange.end);

        if (query.metric === "fuel_spend") {
            total += fuelLogs.reduce((sum, log) => sum + log.total_cost, 0);
        } else if (query.metric === "maintenance_spend") {
            total += maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);
        } else {
            total += fuelLogs.reduce((sum, log) => sum + log.total_cost, 0);
            total += maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);
        }
    }

    const label =
        query.metric === "fuel_spend"
            ? "Fuel spend"
            : query.metric === "maintenance_spend"
                ? "Maintenance spend"
                : "Total spend";

    const vehicleLabel = getVehicleLabel(vehicles);
    return {
        metric: query.metric,
        scope: query.scope,
        vehicleIds: vehicles.map((vehicle) => vehicle.id),
        value: total,
        unit: profile.currency,
        label,
        summary: `Your ${label.toLowerCase()} for ${vehicleLabel} during ${query.dateRange.label} was ${formatCurrency(total, profile.currency)}.`,
        dateRangeLabel: query.dateRange.label,
        hasSufficientData: true,
    };
}

function getCountResult(
    query: CopilotAnalyticsQuery,
    vehicles: VehicleWithLogs[],
): CopilotAnalyticsResult {
    let total = 0;

    for (const vehicle of vehicles) {
        if (query.metric === "service_count") {
            total += filterLogsByDate(vehicle.maintenance_logs ?? [], query.dateRange.start, query.dateRange.end).length;
        } else {
            total += filterLogsByDate(vehicle.fuel_logs ?? [], query.dateRange.start, query.dateRange.end).length;
        }
    }

    const label = query.metric === "service_count" ? "Service count" : "Refuel count";
    const vehicleLabel = getVehicleLabel(vehicles);

    return {
        metric: query.metric,
        scope: query.scope,
        vehicleIds: vehicles.map((vehicle) => vehicle.id),
        value: total,
        unit: null,
        label,
        summary:
            query.metric === "service_count"
                ? `You recorded ${total} maintenance event${total === 1 ? "" : "s"} for ${vehicleLabel} during ${query.dateRange.label}.`
                : `You recorded ${total} fuel or charge event${total === 1 ? "" : "s"} for ${vehicleLabel} during ${query.dateRange.label}.`,
        dateRangeLabel: query.dateRange.label,
        hasSufficientData: true,
    };
}

function getOdometerResult(query: CopilotAnalyticsQuery, vehicles: VehicleWithLogs[], profile: AnalyticsProfile): CopilotAnalyticsResult {
    const vehicle = vehicles[0];
    const currentOdometer = getCurrentOdometer(vehicle);
    const vehicleLabel = getVehicleLabel(vehicles);

    return {
        metric: query.metric,
        scope: query.scope,
        vehicleIds: [vehicle.id],
        value: currentOdometer,
        unit: profile.distanceUnit,
        label: "Current odometer",
        summary: `The current odometer reading for ${vehicleLabel} is ${formatNumber(currentOdometer, 0)} ${profile.distanceUnit}.`,
        dateRangeLabel: query.dateRange.label,
        hasSufficientData: true,
    };
}

function getFuelEfficiencyResult(
    query: CopilotAnalyticsQuery,
    vehicles: VehicleWithLogs[],
    profile: AnalyticsProfile,
): CopilotAnalyticsResult {
    let totalDistance = 0;
    let totalVolume = 0;
    let unit: string | null = null;

    for (const vehicle of vehicles) {
        const analytics = buildFuelAnalytics(vehicle.fuel_logs ?? [], vehicle.baseline_odometer);
        const fuelSegments = analytics.fuel.closed_segments.filter(
            (segment) => segment.closing_log_date >= query.dateRange.start && segment.closing_log_date <= query.dateRange.end,
        );
        const chargeSegments = analytics.charge.closed_segments.filter(
            (segment) => segment.closing_log_date >= query.dateRange.start && segment.closing_log_date <= query.dateRange.end,
        );

        const segments = fuelSegments.length > 0 ? fuelSegments : chargeSegments;
        if (segments.length === 0) {
            continue;
        }

        const isCharge = fuelSegments.length === 0 && chargeSegments.length > 0;
        unit = isCharge ? (profile.distanceUnit === "miles" ? "mi/kWh" : "km/kWh") : (profile.distanceUnit === "miles" ? "MPG" : "km/L");

        totalDistance += segments.reduce((sum, segment) => sum + segment.distance, 0);
        totalVolume += segments.reduce((sum, segment) => sum + segment.volume, 0);
    }

    const vehicleLabel = getVehicleLabel(vehicles);
    const hasData = totalDistance > 0 && totalVolume > 0;
    const efficiency = hasData ? totalDistance / totalVolume : null;

    return {
        metric: query.metric,
        scope: query.scope,
        vehicleIds: vehicles.map((vehicle) => vehicle.id),
        value: efficiency,
        unit,
        label: "Average fuel efficiency",
        summary: hasData && efficiency != null
            ? `Your average efficiency for ${vehicleLabel} during ${query.dateRange.label} was ${formatNumber(efficiency)} ${unit}.`
            : `I don’t have enough closed fuel or charge sessions to calculate efficiency for ${vehicleLabel} during ${query.dateRange.label}.`,
        dateRangeLabel: query.dateRange.label,
        hasSufficientData: hasData,
    };
}

export function computeCopilotAnalytics(
    query: CopilotAnalyticsQuery,
    allVehicles: VehicleWithLogs[],
    profile: AnalyticsProfile,
): CopilotAnalyticsResult {
    const scopedVehicles = getScopedVehicles(query, allVehicles);

    if (scopedVehicles.length === 0) {
        return {
            metric: query.metric,
            scope: query.scope,
            vehicleIds: [],
            value: null,
            unit: null,
            label: "No matching data",
            summary: "I couldn’t find matching vehicle data for that question.",
            dateRangeLabel: query.dateRange.label,
            hasSufficientData: false,
        };
    }

    switch (query.metric) {
        case "distance":
            return getDistanceResult(query, scopedVehicles, profile);
        case "fuel_spend":
        case "maintenance_spend":
        case "total_spend":
            return getSpendResult(query, scopedVehicles, profile);
        case "service_count":
        case "refuel_count":
            return getCountResult(query, scopedVehicles);
        case "odometer":
            return getOdometerResult(query, scopedVehicles, profile);
        case "fuel_efficiency":
            return getFuelEfficiencyResult(query, scopedVehicles, profile);
        default:
            return {
                metric: query.metric,
                scope: query.scope,
                vehicleIds: scopedVehicles.map((vehicle) => vehicle.id),
                value: null,
                unit: null,
                label: "Unsupported metric",
                summary: "I can’t compute that metric yet.",
                dateRangeLabel: query.dateRange.label,
                hasSufficientData: false,
            };
    }
}
