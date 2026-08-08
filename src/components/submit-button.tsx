"use client";

import { Loader2 } from "lucide-react";

import { ui } from "@/content/en/ui";
import { Button } from "@mattofficial/veloce-ui";

type SubmitButtonProps = {
  isPending: boolean;
  children: React.ReactNode;
  /** Defaults to "Saving..."; override for verbs that are not saving. */
  pendingLabel?: string;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  disabled?: boolean;
};

/**
 * The full-width form submit used across every modal: same height, same
 * spinner, same disabled-while-pending rule. Each form used to spell this out,
 * and they had drifted apart on all three.
 */
export function SubmitButton({
  isPending,
  children,
  pendingLabel = ui.common.actions.saving,
  className = "",
  variant,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant={variant}
      disabled={isPending || disabled}
      className={`h-11 w-full rounded-full text-base font-semibold ${className}`}
    >
      {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
      {isPending ? pendingLabel : children}
    </Button>
  );
}
