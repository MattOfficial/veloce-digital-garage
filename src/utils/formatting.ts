const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  GBP: "£",
  EUR: "€",
  JPY: "¥",
};

export function getCurrencySymbol(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized) return "₹";
  return CURRENCY_SYMBOLS[normalized.toUpperCase()] ?? normalized;
}

const CURRENCY_CODES: Record<string, string> = Object.fromEntries(
  Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => [symbol, code]),
);

/**
 * ISO code for a stored currency, which is a code on some rows and a symbol on
 * others. Needed wherever a symbol cannot be drawn — see `getPdfCurrencyLabel`.
 */
export function getCurrencyCode(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized) return "INR";

  const upper = normalized.toUpperCase();
  if (CURRENCY_SYMBOLS[upper]) return upper;

  return CURRENCY_CODES[normalized] ?? upper;
}

export function formatMoney(
  value: number,
  currency?: string | null,
  options: Intl.NumberFormatOptions = {},
) {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    ...options,
  }).format(value)}`;
}

/** Money with cents always shown — the right form for a table of amounts. */
export function formatMoneyExact(value: number, currency?: string | null) {
  return formatMoney(value, currency, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Abbreviated for chart axes, where a full figure would not fit. */
export function formatMoneyCompact(value: number, currency?: string | null) {
  return formatMoney(value, currency, {
    notation: "compact",
    maximumFractionDigits: 1,
  });
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

/**
 * Distances read as whole numbers unless the figure is small enough that a
 * decimal carries information (2.4 km/day versus 2 km/day).
 */
export function formatDistance(
  value: number,
  unit?: string | null,
  options: { decimals?: number } = {},
) {
  const formatted = formatNumber(value, {
    maximumFractionDigits: options.decimals ?? 0,
  });

  return unit ? `${formatted} ${unit}` : formatted;
}

/** Compact axis and tooltip label: "12 Mar". */
export function formatDayLabel(date: string | Date) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/**
 * Unambiguous date for tables. Fixed to en-GB day-first: a locale-dependent
 * numeric date is unreadable across regions, and this app is India-first.
 */
export function formatTableDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
