import { describe, expect, it } from "vitest";
import type { VehicleWithLogs } from "@/types/database";
import {
  ACTIVITY_HEATMAP_DAYS,
  buildActivityHeatmap,
  normalizeActivityDate,
  toLocalDateKey,
} from "@/utils/activity-heatmap";
import { makeFuelLog, makeMaintenanceLog } from "@/__tests__/factories";

type ActivityVehicle = Pick<
  VehicleWithLogs,
  "fuel_logs" | "maintenance_logs"
>;

function makeVehicle(
  fuelDates: string[] = [],
  maintenanceDates: string[] = [],
): ActivityVehicle {
  return {
    fuel_logs: fuelDates.map((date, index) =>
      makeFuelLog({
        id: `fuel-${index}`,
        vehicle_id: "vehicle-1",
        date,
        odometer: 10_000 + index,
        fuel_volume: 20,
        total_cost: 1_000,
        created_at: `${date}T12:00:00Z`,
      }),
    ),
    maintenance_logs: maintenanceDates.map((date, index) =>
      makeMaintenanceLog({
        id: `maintenance-${index}`,
        vehicle_id: "vehicle-1",
        date,
        odometer: 10_000 + index,
        created_at: `${date}T12:00:00Z`,
      }),
    ),
  };
}

function findDay(
  data: ReturnType<typeof buildActivityHeatmap>,
  date: string,
) {
  return data.weeks.flatMap((week) => week.days).find((day) => day.date === date);
}

describe("activity heatmap", () => {
  const endDate = new Date(2025, 5, 15, 12);

  it("builds an inclusive trailing 365-day range aligned to full weeks", () => {
    const data = buildActivityHeatmap([], endDate);
    const allDays = data.weeks.flatMap((week) => week.days);
    const visibleDays = allDays.filter((day) => day.isInRange);

    expect(data.startDate).toBe("2024-06-16");
    expect(data.endDate).toBe("2025-06-15");
    expect(visibleDays).toHaveLength(ACTIVITY_HEATMAP_DAYS);
    expect(new Date(`${allDays[0].date}T12:00:00`).getDay()).toBe(0);
    expect(
      new Date(`${allDays.at(-1)?.date}T12:00:00`).getDay(),
    ).toBe(6);
  });

  it("combines fuel and maintenance activity across vehicles by day", () => {
    const data = buildActivityHeatmap(
      [
        makeVehicle(["2025-06-10", "2025-06-10"], []),
        makeVehicle([], ["2025-06-10"]),
      ],
      endDate,
    );
    const day = findDay(data, "2025-06-10");

    expect(day).toMatchObject({
      fuelCount: 2,
      maintenanceCount: 1,
      totalCount: 3,
      intensity: 3,
    });
    expect(data.activeDays).toBe(1);
    expect(data.totalActivities).toBe(3);
  });

  it("counts charge sessions separately from liquid fuel", () => {
    const vehicle = {
      fuel_logs: [
        makeFuelLog({ id: "f1", date: "2025-06-10", energy_type: "fuel" }),
        makeFuelLog({ id: "c1", date: "2025-06-10", energy_type: "charge" }),
        makeFuelLog({ id: "c2", date: "2025-06-10", energy_type: "charge" }),
      ],
      maintenance_logs: [],
    };

    const day = findDay(buildActivityHeatmap([vehicle], endDate), "2025-06-10");

    expect(day).toMatchObject({
      fuelCount: 1,
      chargeCount: 2,
      maintenanceCount: 0,
      totalCount: 3,
    });
  });

  it("splits a plug-in hybrid's two streams onto the same day", () => {
    // The split is on the log, not the vehicle, so a PHEV shows under both.
    const phev = {
      fuel_logs: [
        makeFuelLog({ id: "f1", date: "2025-06-11", energy_type: "fuel" }),
        makeFuelLog({ id: "c1", date: "2025-06-11", energy_type: "charge" }),
      ],
      maintenance_logs: [],
    };

    const day = findDay(buildActivityHeatmap([phev], endDate), "2025-06-11");

    expect(day?.fuelCount).toBe(1);
    expect(day?.chargeCount).toBe(1);
  });

  it("caps intensity at four while retaining the full activity count", () => {
    const data = buildActivityHeatmap(
      [makeVehicle(Array.from({ length: 6 }, () => "2025-06-01"))],
      endDate,
    );

    expect(findDay(data, "2025-06-01")).toMatchObject({
      totalCount: 6,
      intensity: 4,
    });
    expect(data.totalActivities).toBe(6);
  });

  it("excludes invalid dates and activity outside the selected range", () => {
    const data = buildActivityHeatmap(
      [
        makeVehicle(
          ["2024-06-15", "2024-06-16", "2025-06-16", "not-a-date"],
          ["2025-06-15", "2025-02-31"],
        ),
      ],
      endDate,
    );

    expect(data.activeDays).toBe(2);
    expect(data.totalActivities).toBe(2);
    expect(findDay(data, "2024-06-16")?.fuelCount).toBe(1);
    expect(findDay(data, "2025-06-15")?.maintenanceCount).toBe(1);
  });

  it("preserves database calendar dates without UTC day shifts", () => {
    expect(normalizeActivityDate("2025-01-02T23:30:00-08:00")).toBe(
      "2025-01-02",
    );
    expect(normalizeActivityDate("2025-02-31")).toBeNull();
    expect(toLocalDateKey(new Date(2025, 0, 2, 23, 59))).toBe("2025-01-02");
  });

  it("supports a shorter range for focused summaries", () => {
    const data = buildActivityHeatmap(
      [makeVehicle(["2025-06-09", "2025-06-10"])],
      new Date(2025, 5, 10, 12),
      2,
    );

    expect(data.startDate).toBe("2025-06-09");
    expect(data.endDate).toBe("2025-06-10");
    expect(data.totalActivities).toBe(2);
  });
});
