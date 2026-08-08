import { cn } from "@/lib/utils";

/**
 * A small status chip for table cells.
 *
 * Each tone carries a background, a text colour and a hairline border, in both
 * themes. Light mode needs a *stronger* wash with darker text and dark mode a
 * fainter one with lighter text — the same opacity in both leaves the light
 * theme washed out and the dark theme shouting.
 *
 * Text shades were picked by measuring contrast against the composited pill
 * background on a tinted table row, not by eye. Pill text is 12px, so it needs
 * WCAG AA for small text (4.5:1); the -700 shades of cyan and orange came in at
 * 4.42 and 4.21 and had to drop to -800, and emerald-700 cleared it by so
 * little (4.52) that it went the same way. Every tone here is above 4.9:1 in
 * light mode and above 9:1 in dark.
 *
 * The classes are written out in full rather than built from the tone name,
 * because Tailwind only ships classes it can see in the source.
 */
export const PILL_TONES = {
  neutral:
    "bg-slate-500/15 text-slate-700 border-slate-500/20 dark:bg-slate-400/10 dark:text-slate-300 dark:border-slate-400/20",
  blue: "bg-blue-500/15 text-blue-700 border-blue-500/20 dark:bg-blue-400/10 dark:text-blue-300 dark:border-blue-400/20",
  emerald:
    "bg-emerald-500/15 text-emerald-800 border-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/20",
  amber:
    "bg-amber-500/20 text-amber-800 border-amber-500/25 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20",
  rose: "bg-rose-500/15 text-rose-700 border-rose-500/20 dark:bg-rose-400/10 dark:text-rose-300 dark:border-rose-400/20",
  violet:
    "bg-violet-500/15 text-violet-700 border-violet-500/20 dark:bg-violet-400/10 dark:text-violet-300 dark:border-violet-400/20",
  cyan: "bg-cyan-500/15 text-cyan-800 border-cyan-500/20 dark:bg-cyan-400/10 dark:text-cyan-300 dark:border-cyan-400/20",
  orange:
    "bg-orange-500/15 text-orange-800 border-orange-500/20 dark:bg-orange-400/10 dark:text-orange-300 dark:border-orange-400/20",
} as const;

export type PillTone = keyof typeof PILL_TONES;

export function Pill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: PillTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium",
        PILL_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A filled dot in the pill's own colour, for a compact colour key. */
export function PillDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("h-1.5 w-1.5 shrink-0 rounded-full bg-current", className)}
    />
  );
}
