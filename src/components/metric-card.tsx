"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@mattofficial/veloce-ui";

/**
 * A headline metric card: a wash of the metric's own colour, an icon chip and
 * the value in that same hue.
 *
 * Shared between the petrol and EV pages so the two cannot drift apart — they
 * sit one vehicle-switch away from each other, and a flat grey tile next to a
 * coloured one reads as unfinished rather than different.
 */

/**
 * Written out in full because Tailwind only ships classes it can see. Value and
 * chip text use the -700/-300 pair: at 30px the value is large text, and the
 * chip holds an icon, so both clear their contrast floor comfortably.
 */
const METRIC_TONES = {
  emerald: {
    wash: "from-emerald-500/10",
    chip: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
    value: "text-emerald-700 dark:text-emerald-300",
  },
  rose: {
    wash: "from-rose-500/10",
    chip: "bg-rose-500/15 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
    value: "text-rose-700 dark:text-rose-300",
  },
  blue: {
    wash: "from-blue-500/10",
    chip: "bg-blue-500/15 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
    value: "text-blue-700 dark:text-blue-300",
  },
  amber: {
    wash: "from-amber-500/10",
    chip: "bg-amber-500/20 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300",
    value: "text-amber-700 dark:text-amber-300",
  },
  violet: {
    wash: "from-violet-500/10",
    chip: "bg-violet-500/15 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
    value: "text-violet-700 dark:text-violet-300",
  },
} as const;

export type MetricTone = keyof typeof METRIC_TONES;

export function MetricCard({
  label,
  value,
  hint,
  tone,
  icon,
  action,
}: {
  label: string;
  value: string;
  /** Plain text, or nodes when a caller needs to colour part of it. */
  hint?: React.ReactNode;
  tone: MetricTone;
  icon: React.ReactNode;
  /** Sits beside the icon — the unit picker on the fuel page uses it. */
  action?: React.ReactNode;
}) {
  const tones = METRIC_TONES[tone];

  return (
    <Card className="relative h-full gap-4 overflow-hidden rounded-3xl py-5 shadow-sm">
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent",
          tones.wash,
        )}
      />
      <CardHeader className="relative z-10 flex flex-row items-center justify-between gap-2 px-5 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg",
              tones.chip,
            )}
          >
            {icon}
          </span>
          {action}
        </div>
      </CardHeader>
      <CardContent className="relative z-10 px-5">
        <div
          className={cn(
            "text-3xl font-semibold tracking-tight tabular-nums",
            tones.value,
          )}
        >
          {value}
        </div>
        {hint ? (
          <div className="mt-1 flex flex-wrap items-center gap-x-1 text-xs font-medium text-muted-foreground">
            {hint}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
