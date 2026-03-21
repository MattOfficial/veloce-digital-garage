"use client";

import { useState, useTransition } from "react";
import {
  Loader2,
  Plus,
  Droplets,
  Wrench,
  Sparkles,
  Receipt,
  Map,
  Zap,
  Battery,
  Car,
  PaintBucket,
  Umbrella,
} from "lucide-react";
import { createTrackerCategory } from "@/app/actions/custom-trackers";
import { useVehicleStore } from "@/store/vehicle-store";
import { useRouter } from "next/navigation";
import { ui } from "@/content/en/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Button,
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Switch,
} from "@mattofficial/veloce-ui";

const ICONS = [
  { name: "Sparkles", label: ui.trackers.iconLabels.Sparkles, icon: Sparkles },
  { name: "Droplets", label: ui.trackers.iconLabels.Droplets, icon: Droplets },
  {
    name: "PaintBucket",
    label: ui.trackers.iconLabels.PaintBucket,
    icon: PaintBucket,
  },
  { name: "Receipt", label: ui.trackers.iconLabels.Receipt, icon: Receipt },
  { name: "Wrench", label: ui.trackers.iconLabels.Wrench, icon: Wrench },
  { name: "Map", label: ui.trackers.iconLabels.Map, icon: Map },
  { name: "Zap", label: ui.trackers.iconLabels.Zap, icon: Zap },
  { name: "Battery", label: ui.trackers.iconLabels.Battery, icon: Battery },
  { name: "Car", label: ui.trackers.iconLabels.Car, icon: Car },
  { name: "Umbrella", label: ui.trackers.iconLabels.Umbrella, icon: Umbrella },
];

const COLORS = [
  { name: ui.trackers.colorLabels.blue, value: "blue" },
  { name: ui.trackers.colorLabels.emerald, value: "emerald" },
  { name: ui.trackers.colorLabels.violet, value: "violet" },
  { name: ui.trackers.colorLabels.rose, value: "rose" },
  { name: ui.trackers.colorLabels.amber, value: "amber" },
  { name: ui.trackers.colorLabels.slate, value: "slate" },
];

export function AddTrackerModal({
  onTrackerAdded,
}: {
  onTrackerAdded?: () => void;
}) {
  const { fetchVehicles, selectedVehicleId } = useVehicleStore();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0].name);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.append("icon", selectedIcon);
    formData.append("color_theme", selectedColor);

    startTransition(async () => {
      const result = await createTrackerCategory(formData);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setOpen(false);
        setMessage(null);
        fetchVehicles();
        router.refresh();
        if (onTrackerAdded) onTrackerAdded();
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) setMessage(null);
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-dashed border-2 bg-muted/20 hover:bg-muted/50 rounded-2xl h-full min-h-35 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 w-full group"
        >
          <div className="bg-background rounded-full p-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Plus className="h-6 w-6" />
          </div>
          <span className="font-medium tracking-tight">
            {ui.trackers.createTrackerTrigger}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25 rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {ui.trackers.createTrackerTitle}
          </DialogTitle>
          <DialogDescription>
            {ui.trackers.createTrackerDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 pt-4">
          <input
            type="hidden"
            name="vehicle_id"
            value={selectedVehicleId || ""}
          />
          <div className="space-y-2">
            <Label htmlFor="name">{ui.trackers.trackerName}</Label>
            <Input
              id="name"
              name="name"
              placeholder={ui.trackers.trackerNamePlaceholder}
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>{ui.trackers.selectIcon}</Label>
            <TooltipProvider>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((ico) => {
                  const IconComponent = ico.icon;
                  const isSelected = selectedIcon === ico.name;
                  return (
                    <Tooltip key={ico.name}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setSelectedIcon(ico.name)}
                          className={`p-3 rounded-xl transition-all duration-200 border-2 ${isSelected ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-muted/50 hover:bg-muted text-muted-foreground"}`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="rounded-xl px-3 py-1.5 text-xs font-semibold"
                      >
                        {ico.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          <div className="space-y-3">
            <Label>{ui.trackers.colorTheme}</Label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => {
                const isSelected = selectedColor === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-10 h-10 rounded-full transition-all duration-300 cursor-pointer border-[3px] flex items-center justify-center ${isSelected ? "border-foreground shadow-sm scale-110" : "border-transparent hover:scale-105"}`}
                    style={{
                      backgroundColor: `var(--${c.value}-500, ${getColorHex(c.value)})`,
                    }}
                    title={c.name}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
            <div className="space-y-0.5">
              <Label htmlFor="track_cost" className="text-base">
                {ui.trackers.trackCost}
              </Label>
              <p className="text-sm text-muted-foreground">
                {ui.trackers.trackCostDescription}
              </p>
            </div>
            <Switch
              id="track_cost"
              name="track_cost"
              value="true"
              defaultChecked
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl text-sm ${message.type === "error" ? "bg-destructive/15 text-destructive" : "bg-emerald-500/15 text-emerald-600"}`}
            >
              {message.text}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full h-12 text-base font-semibold shadow-md active:scale-[0.98] transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                {ui.trackers.creatingTracker}
              </>
            ) : (
              ui.trackers.buildTracker
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function getColorHex(color: string) {
  const map: Record<string, string> = {
    blue: "#3b82f6",
    emerald: "#10b981",
    violet: "#8b5cf6",
    rose: "#f43f5e",
    amber: "#f59e0b",
    slate: "#64748b",
  };
  return map[color] || "#64748b";
}
