"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  const isSmall = size === "sm";

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer inline-flex shrink-0 items-center rounded-full border border-border/70",
        "bg-muted/80 shadow-sm transition-colors duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-primary/60 data-[state=checked]:bg-primary",
        isSmall ? "h-5 w-9" : "h-6 w-11",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-md ring-0 transition-transform duration-200",
          isSmall ? "size-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5" : "size-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
