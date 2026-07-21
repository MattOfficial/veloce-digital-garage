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
