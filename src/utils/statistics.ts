/**
 * Robust summary statistics for noisy vehicle data.
 *
 * Every figure here is derived from readings a human typed off a dashboard, so
 * the tails are fat: a mistyped odometer or an unlogged charge produces a value
 * orders of magnitude off. Median-based measures survive that; a mean does not.
 */

/** Floor for an outlier threshold, as a fraction of the median. */
const DEFAULT_MIN_RELATIVE_SPREAD = 0.5;
const DEFAULT_MAD_MULTIPLIER = 3;

export function median(values: number[]): number | null {
  if (values.length === 0) return null;

  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export function medianAbsoluteDeviation(values: number[], center: number): number {
  return median(values.map((value) => Math.abs(value - center))) ?? 0;
}

/**
 * Spread as a fraction of the mean. Used to score how repeatable a set of
 * readings is, which is the honest input to a confidence label.
 */
export function coefficientOfVariation(values: number[]): number | null {
  if (values.length < 2) return null;

  const mean = values.reduce((total, value) => total + value, 0) / values.length;
  if (mean <= 0) return null;

  const variance =
    values.reduce((total, value) => total + (value - mean) ** 2, 0) / values.length;

  return Math.sqrt(variance) / mean;
}

/** 0-100, where 100 is perfectly repeatable. Null when there is nothing to compare. */
export function consistencyScore(values: number[]): number | null {
  const variation = coefficientOfVariation(values);
  return variation == null ? null : Math.max(0, Math.min(100, (1 - variation) * 100));
}

export interface OutlierBounds {
  center: number;
  limit: number;
}

/**
 * Median-absolute-deviation bounds, which assume nothing about the distribution.
 *
 * Very consistent data collapses the deviation to zero, which would then reject
 * everything that is not exactly the median, so the limit never falls below a
 * fraction of the centre.
 */
export function getOutlierBounds(
  values: number[],
  options: { madMultiplier?: number; minRelativeSpread?: number } = {},
): OutlierBounds | null {
  const {
    madMultiplier = DEFAULT_MAD_MULTIPLIER,
    minRelativeSpread = DEFAULT_MIN_RELATIVE_SPREAD,
  } = options;

  const center = median(values);
  if (center == null || center <= 0) return null;

  const deviation = medianAbsoluteDeviation(values, center);

  return {
    center,
    limit: Math.max(madMultiplier * deviation, center * minRelativeSpread),
  };
}

/** Least-squares slope of y against x. Null when x has no spread. */
export function leastSquaresSlope(
  points: { x: number; y: number }[],
): number | null {
  if (points.length < 2) return null;

  const meanX = points.reduce((total, point) => total + point.x, 0) / points.length;
  const meanY = points.reduce((total, point) => total + point.y, 0) / points.length;

  let numerator = 0;
  let denominator = 0;

  for (const point of points) {
    numerator += (point.x - meanX) * (point.y - meanY);
    denominator += (point.x - meanX) ** 2;
  }

  return denominator > 0 ? numerator / denominator : null;
}
