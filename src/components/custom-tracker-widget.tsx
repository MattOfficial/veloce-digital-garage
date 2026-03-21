"use client";

import { useState, useTransition, useMemo } from "react";

import { CustomLog, CustomLogCategory } from "@/types/database";
import {
  Sparkles,
  Droplets,
  PaintBucket,
  Receipt,
  Wrench,
  Map,
  Zap,
  Battery,
  Car,
  Umbrella,
  Plus,
  Loader2,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  addCustomLog,
  deleteTrackerCategory,
} from "@/app/actions/custom-trackers";
import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import { cn } from "@/lib/utils";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
} from "@mattofficial/veloce-ui";

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Droplets,
  PaintBucket,
  Receipt,
  Wrench,
  Map,
  Zap,
  Battery,
  Car,
  Umbrella,
};

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

export function CustomTrackerWidget({
  category,
  logs,
  vehicleId,
}: {
  category: CustomLogCategory;
  logs: CustomLog[];
  vehicleId: string;
}) {
  const { profile } = useUserStore();
  const { fetchVehicles } = useVehicleStore();
  const router = useRouter();
  const currencySymbol =
    profile.currency === "USD"
      ? "$"
      : profile.currency === "EUR"
        ? "€"
        : profile.currency === "GBP"
          ? "£"
          : "₹";

  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const IconComponent = ICON_MAP[category.icon] || Wrench;
  const themeColor = getColorHex(category.color_theme);

  function onSubmitLog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.append("vehicle_id", vehicleId);
    formData.append("category_id", category.id);

    startTransition(async () => {
      const result = await addCustomLog(formData);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setOpenDialog(false);
        setMessage(null);
        fetchVehicles();
      }
    });
  }

  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteCategory() {
    if (!confirm(ui.trackers.deleteTrackerConfirm(category.name))) {
      return;
    }
    setIsDeleting(true);
    const result = await deleteTrackerCategory(category.id);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
      setIsDeleting(false);
    } else {
      fetchVehicles();
      router.refresh();
    }
  }

  // Sort logs descending by date, cached unless `logs` array changes
  const sortedLogs = useMemo(() => {
    return [...logs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [logs]);

  return (
    <Card className="rounded-[2rem] shadow-sm border overflow-hidden h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 border-b">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center">
            <div
              className="bg-primary/10 p-1.5 rounded-md mr-3 shadow-sm border border-black/5"
              style={{
                backgroundColor: `${themeColor}20`,
                color: themeColor,
                borderColor: `${themeColor}40`,
              }}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            {category.name}
          </CardTitle>
          <CardDescription>
            {ui.trackers.widgetDescription(category.name)}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Dialog
            open={openDialog}
            onOpenChange={(o) => {
              if (!o) setMessage(null);
              setOpenDialog(o);
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full shadow-sm"
                style={{ color: themeColor, borderColor: `${themeColor}50` }}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                {ui.trackers.logEvent}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 rounded-[2rem]">
              <DialogHeader>
                <DialogTitle>{ui.trackers.logNew(category.name)}</DialogTitle>
                <DialogDescription>
                  {ui.trackers.logNewDescription}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={onSubmitLog} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="date">{ui.trackers.logDate}</Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    required
                    className="rounded-xl"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {category.track_cost && (
                  <div className="space-y-2">
                    <Label htmlFor="cost">
                      {ui.trackers.totalCost(currencySymbol)}
                    </Label>
                    <Input
                      type="number"
                      id="cost"
                      name="cost"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="rounded-xl"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">{ui.trackers.notesDetails}</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder={ui.trackers.notesPlaceholder}
                    className="rounded-xl min-h-25"
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
                  style={{ backgroundColor: themeColor, color: "#fff" }}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    ui.trackers.saveLog
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
            onClick={handleDeleteCategory}
            disabled={isDeleting}
            title={ui.trackers.deleteTracker}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col relative">
        {isDeleting && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {sortedLogs.length > 0 ? (
          <div className="overflow-y-auto overflow-x-hidden flex-1 p-4 space-y-3 max-h-100 scrollbar-thin">
            {sortedLogs.map((log) => (
              <LogBubble
                key={log.id}
                log={log}
                category={category}
                currencySymbol={currencySymbol}
                themeColor={themeColor}
                IconComponent={IconComponent}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/5 flex-1 min-h-50">
            <div
              className="p-4 rounded-full mb-4 shadow-sm border border-black/5 opacity-50"
              style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
            >
              <IconComponent className="h-8 w-8" />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-foreground/80">
              {ui.trackers.noEntriesYet}
            </h3>
            <p className="text-sm text-muted-foreground w-3/4 mb-4">
              {ui.trackers.noEntriesDescription}
            </p>
            <p className="text-muted-foreground text-sm max-w-62.5 mt-1 mb-5">
              {ui.trackers.startTrackingDescription(category.name)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LogBubble({
  log,
  category,
  currencySymbol,
  themeColor,
  IconComponent,
}: {
  log: CustomLog;
  category: CustomLogCategory;
  currencySymbol: string;
  themeColor: string;
  IconComponent: React.ElementType;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="group relative flex flex-col gap-3 p-4 rounded-3xl border bg-card hover:bg-muted/40 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
      style={{ borderColor: `${themeColor}20` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-full shrink-0"
            style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
          >
            <IconComponent className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground/90">
              {new Date(log.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {category.track_cost && log.cost !== null && (
            <div
              className="font-bold text-sm tracking-tight"
              style={{ color: themeColor }}
            >
              {currencySymbol}
              {log.cost.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          )}
          {log.notes && (
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-300",
                expanded ? "rotate-180" : "",
              )}
            />
          )}
        </div>
      </div>

      {log.notes && (
        <div
          className={cn(
            "text-sm text-muted-foreground/90 pl-11 pr-4 leading-relaxed transition-all duration-300 ease-in-out",
            expanded
              ? "line-clamp-none pb-2 opacity-100"
              : "line-clamp-2 opacity-80",
          )}
        >
          {log.notes}
        </div>
      )}

      {!log.notes && expanded && (
        <div className="text-xs italic text-muted-foreground/50 pl-11 pb-2">
          {ui.trackers.noAdditionalDetails}
        </div>
      )}
    </div>
  );
}
