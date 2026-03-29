"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "../lib/utils";

function Calendar({
  className,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className={cn("bg-background p-3 rounded-lg border", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month_caption: "relative flex items-center justify-center h-9 font-medium text-sm",
        nav: "absolute top-0 inset-x-0 flex justify-between",
        button_previous: "h-9 w-9 p-0 flex items-center justify-center rounded-md hover:bg-accent",
        button_next: "h-9 w-9 p-0 flex items-center justify-center rounded-md hover:bg-accent",
        weekdays: "flex w-full",
        weekday: "flex-1 text-muted-foreground text-xs font-normal h-8 flex items-center justify-center",
        week: "flex w-full mt-2",
        day: "h-9 w-9 p-0 text-center text-sm",
        day_button: "h-9 w-9 p-0 rounded-md hover:bg-accent flex items-center justify-center",
        selected: "bg-primary text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground rounded-md",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className="h-4 w-4" />;
          }
          if (orientation === "right") {
            return <ChevronRightIcon className="h-4 w-4" />;
          }
          return <ChevronRightIcon className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
