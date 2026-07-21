type UnitPriceSession = {
  total_cost: number;
  fuel_volume: number;
};

export type UnitPriceDirection = "up" | "down" | "flat" | "unavailable";

export type UnitPriceSummary = {
  latest: number | null;
  previous: number | null;
  changePercent: number | null;
  direction: UnitPriceDirection;
};

export function getUnitPriceSummary(
  sessions: readonly UnitPriceSession[],
): UnitPriceSummary {
  const prices = sessions
    .filter(
      (session) =>
        Number.isFinite(session.total_cost) &&
        Number.isFinite(session.fuel_volume) &&
        session.total_cost >= 0 &&
        session.fuel_volume > 0,
    )
    .map((session) => session.total_cost / session.fuel_volume);

  const latest = prices.length > 0 ? prices[prices.length - 1] : null;
  const previous = prices.length > 1 ? prices[prices.length - 2] : null;

  if (latest == null) {
    return {
      latest: null,
      previous: null,
      changePercent: null,
      direction: "unavailable",
    };
  }

  if (previous == null) {
    return {
      latest,
      previous: null,
      changePercent: null,
      direction: "unavailable",
    };
  }

  const direction = latest > previous ? "up" : latest < previous ? "down" : "flat";
  const changePercent =
    previous === 0
      ? latest === 0
        ? 0
        : null
      : ((latest - previous) / previous) * 100;

  return { latest, previous, changePercent, direction };
}
