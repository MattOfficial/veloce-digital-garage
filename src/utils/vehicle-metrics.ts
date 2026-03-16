import { addMonths, differenceInCalendarDays } from "date-fns";

import type { ServiceReminder } from "@/types/database";

export const VEHICLE_SERVICE_INTERVAL_NAME = "Scheduled Service";

type VehicleForOdometer = {
    baseline_odometer: number;
    current_odometer?: number | null;
    fuel_logs?: Array<{ odometer: number }>;
    maintenance_logs?: Array<{ odometer?: number | null }>;
};

export type ReminderHealth = "healthy" | "due-soon" | "overdue" | "needs-baseline";

export type ServiceReminderStatus = {
    reminder: ServiceReminder;
    status: ReminderHealth;
    distanceDueAt: number | null;
    distanceRemaining: number | null;
    distanceProgress: number | null;
    dueDate: Date | null;
    daysRemaining: number | null;
    timeProgress: number | null;
    overallProgress: number | null;
    missingDistanceBaseline: boolean;
    missingTimeBaseline: boolean;
};

function getMaxNumber(values: Array<number | null | undefined>) {
    const finiteValues = values.filter((value): value is number => Number.isFinite(value));
    return finiteValues.length > 0 ? Math.max(...finiteValues) : null;
}

export function normalizeServiceType(value: string) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

export function serviceTypesMatch(left: string, right: string) {
    const normalizedLeft = normalizeServiceType(left);
    const normalizedRight = normalizeServiceType(right);

    if (!normalizedLeft || !normalizedRight) {
        return false;
    }

    return normalizedLeft === normalizedRight
        || normalizedLeft.includes(normalizedRight)
        || normalizedRight.includes(normalizedLeft);
}

export function isRoutineServiceType(value: string) {
    const normalized = normalizeServiceType(value);

    return normalized.includes("service") || normalized.includes("inspection");
}

export function getVehicleServiceInterval<T extends { service_type: string }>(reminders: T[] = []) {
    return reminders.find((reminder) => reminder.service_type === VEHICLE_SERVICE_INTERVAL_NAME)
        ?? reminders[0]
        ?? null;
}

export function getVehicleCurrentOdometer(vehicle: VehicleForOdometer) {
    return Math.max(
        vehicle.baseline_odometer || 0,
        vehicle.current_odometer || 0,
        getMaxNumber(vehicle.fuel_logs?.map((log) => log.odometer) || []) || 0,
        getMaxNumber(vehicle.maintenance_logs?.map((log) => log.odometer) || []) || 0,
    );
}

export function getServiceReminderStatus(
    reminder: ServiceReminder,
    currentOdometer: number,
    today: Date = new Date(),
): ServiceReminderStatus {
    const todayStart = new Date(today);
    const distanceDueAt = reminder.recurring_distance != null && reminder.last_completed_odometer != null
        ? reminder.last_completed_odometer + reminder.recurring_distance
        : null;
    const distanceRemaining = distanceDueAt != null ? distanceDueAt - currentOdometer : null;
    const dueDate = reminder.recurring_months != null && reminder.last_completed_date
        ? addMonths(new Date(reminder.last_completed_date), reminder.recurring_months)
        : null;
    const daysRemaining = dueDate ? differenceInCalendarDays(dueDate, today) : null;
    const distanceProgress = reminder.recurring_distance != null && reminder.last_completed_odometer != null
        ? (currentOdometer - reminder.last_completed_odometer) / reminder.recurring_distance
        : null;
    const timeProgress = reminder.recurring_months != null && reminder.last_completed_date && dueDate
        ? (
            differenceInCalendarDays(todayStart, new Date(reminder.last_completed_date))
            / Math.max(1, differenceInCalendarDays(dueDate, new Date(reminder.last_completed_date)))
        )
        : null;
    const progressValues = [distanceProgress, timeProgress].filter((value): value is number => value != null);
    const overallProgress = progressValues.length > 0 ? Math.max(...progressValues) : null;

    const missingDistanceBaseline = reminder.recurring_distance != null && reminder.last_completed_odometer == null;
    const missingTimeBaseline = reminder.recurring_months != null && !reminder.last_completed_date;

    let status: ReminderHealth = "healthy";
    if (missingDistanceBaseline || missingTimeBaseline) {
        status = "needs-baseline";
    }

    if ((distanceRemaining != null && distanceRemaining <= 0) || (daysRemaining != null && daysRemaining <= 0)) {
        status = "overdue";
    } else if (overallProgress != null && overallProgress >= 0.8) {
        status = "due-soon";
    }

    return {
        reminder,
        status,
        distanceDueAt,
        distanceRemaining,
        distanceProgress,
        dueDate,
        daysRemaining,
        timeProgress,
        overallProgress,
        missingDistanceBaseline,
        missingTimeBaseline,
    };
}
