/**
 * Smart cadence prediction utilities for fuel/charge refill predictions
 */

export type RefillStatus =
  | "on-track"
  | "refuelling-soon"
  | "refuelling-imminent"
  | "overdue"
  | "insufficient-data";

export interface SmartRefillPrediction {
  /** The adjusted next refill date (always in the future or null) */
  adjustedDate: Date | null;
  /** The original projected date (may be in the past) */
  originalDate: Date | null;
  /** Human-friendly status category */
  status: RefillStatus;
  /** Human-readable message for display */
  message: string;
  /** Days until/since the adjusted date (positive for future, negative for past) */
  daysDifference: number;
  /** Whether the original projection was in the past */
  wasProjectionPast: boolean;
  /** Number of cycles missed if projection was past */
  cyclesMissed: number;
}

/**
 * Calculate a smart next refill prediction that adjusts for missed dates
 *
 * @param cadenceEndDate The date of the last closed cadence segment
 * @param averageDaysBetween Average days between refills from cadence data
 * @param currentDate The current date (defaults to now)
 * @returns Smart prediction with adjusted date and status
 */
export function calculateSmartNextRefill(
  cadenceEndDate: Date | null,
  averageDaysBetween: number,
  currentDate: Date = new Date(),
): SmartRefillPrediction {
  // Handle insufficient data cases
  if (!cadenceEndDate || averageDaysBetween <= 0) {
    return {
      adjustedDate: null,
      originalDate: null,
      status: "insufficient-data",
      message: "Insufficient data to predict next refill",
      daysDifference: 0,
      wasProjectionPast: false,
      cyclesMissed: 0,
    };
  }

  // Calculate the original projection
  const originalProjectedDate = new Date(
    cadenceEndDate.getTime() +
      Math.round(averageDaysBetween) * 24 * 60 * 60 * 1000,
  );

  // Check if the original projection is in the past
  const wasProjectionPast = originalProjectedDate < currentDate;

  let adjustedDate: Date | null = originalProjectedDate;
  let cyclesMissed = 0;

  // If projection is in the past, calculate the next future date
  if (wasProjectionPast) {
    const timeDiff = currentDate.getTime() - originalProjectedDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    cyclesMissed = Math.floor(daysDiff / averageDaysBetween) + 1;

    // Calculate next future date by adding missed cycles
    adjustedDate = new Date(
      originalProjectedDate.getTime() +
        Math.round(cyclesMissed * averageDaysBetween) * 24 * 60 * 60 * 1000,
    );
  }

  // Calculate days difference from current date
  const daysDifference = adjustedDate
    ? Math.round(
        (adjustedDate.getTime() - currentDate.getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  // Determine status based on days difference
  let status: RefillStatus;
  let message: string;

  if (wasProjectionPast) {
    status = "overdue";
    message = `Overdue - next refill predicted`;
  } else if (daysDifference <= 0) {
    status = "refuelling-imminent";
    message = "Refuelling imminent";
  } else if (daysDifference <= 2) {
    status = "refuelling-soon";
    message = "Refuelling soon";
  } else {
    status = "on-track";
    message = "On track";
  }

  return {
    adjustedDate,
    originalDate: originalProjectedDate,
    status,
    message,
    daysDifference,
    wasProjectionPast,
    cyclesMissed,
  };
}

/**
 * Get a human-friendly display string for a refill prediction
 *
 * @param prediction The smart prediction result
 * @param mode 'fuel' or 'charge' for context-specific messaging
 * @returns Formatted string for UI display
 */
export function getRefillDisplayString(
  prediction: SmartRefillPrediction,
  mode: "fuel" | "charge" = "fuel",
): string {
  const action = mode === "charge" ? "charging" : "refuelling";

  if (prediction.status === "insufficient-data") {
    return "Insufficient data to predict";
  }

  if (!prediction.adjustedDate) {
    return "Unable to calculate prediction";
  }

  const dateStr = prediction.adjustedDate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  if (prediction.status === "overdue") {
    if (prediction.cyclesMissed > 1) {
      return `${dateStr} (${prediction.cyclesMissed} cycles missed)`;
    }
    return `${dateStr} (missed)`;
  }

  if (prediction.status === "refuelling-imminent") {
    if (prediction.daysDifference === 0) {
      return `Today - ${action} due`;
    } else if (prediction.daysDifference === 1) {
      return `Tomorrow - ${action} due`;
    }
    return `${dateStr} - ${action} imminent`;
  }

  if (prediction.status === "refuelling-soon") {
    return `${dateStr} - ${action} in ${prediction.daysDifference} days`;
  }

  // on-track
  return dateStr;
}

/**
 * Get CSS class for styling based on refill status
 */
export function getStatusClassName(status: RefillStatus): string {
  switch (status) {
    case "on-track":
      return "text-emerald-600 dark:text-emerald-400";
    case "refuelling-soon":
      return "text-amber-600 dark:text-amber-400";
    case "refuelling-imminent":
      return "text-orange-600 dark:text-orange-400";
    case "overdue":
      return "text-rose-600 dark:text-rose-400";
    case "insufficient-data":
      return "text-slate-500 dark:text-slate-400";
  }
}

/**
 * Get icon name for refill status (using Lucide icon names)
 */
export function getStatusIcon(status: RefillStatus): string {
  switch (status) {
    case "on-track":
      return "CheckCircle";
    case "refuelling-soon":
      return "Clock";
    case "refuelling-imminent":
      return "AlertCircle";
    case "overdue":
      return "AlertTriangle";
    case "insufficient-data":
      return "HelpCircle";
  }
}
