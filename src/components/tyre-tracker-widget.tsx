"use client";

import { useState, useTransition, useMemo } from "react";
import { VehicleWithLogs, TyreInfo, TireItem } from "@/types/database";
import { Disc, Plus, Loader2, CalendarIcon, CheckCircle2 } from "lucide-react";
import { updateVehicle } from "@/app/actions/vehicles";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useVehicleStore } from "@/store/vehicle-store";
import { ui } from "@/content/en/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/veloce-ui";

function parseDotCode(dotCode?: string): Date | null {
  if (!dotCode || dotCode.length !== 4) return null;
  const week = parseInt(dotCode.substring(0, 2), 10);
  const year = parseInt(`20${dotCode.substring(2, 4)}`, 10);
  if (isNaN(week) || isNaN(year) || week < 1 || week > 53) return null;

  const date = new Date(year, 0, 1);
  date.setDate(date.getDate() + (week - 1) * 7);
  return date;
}

type WheelPos = "FL" | "FR" | "RL" | "RR" | "F" | "R";
type ApplyTarget =
  | "ALL"
  | "FRONT"
  | "REAR"
  | "FL"
  | "FR"
  | "RL"
  | "RR"
  | "F"
  | "R";

const MAX_AGE_YEARS = 6;
const MAX_MILEAGE = 50000;

function calculateHealth(tire: TireItem | undefined, latestOdometer: number) {
  if (!tire)
    return {
      status: "missing",
      age: 0,
      mileage: 0,
      message: ui.trackers.tyre.health.noData,
    };

  let manufactureDate = new Date(tire.installed_date);
  const parsedDot = parseDotCode(tire.dot_code);
  if (parsedDot) manufactureDate = parsedDot;

  const ageInMs = new Date().getTime() - manufactureDate.getTime();
  const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
  const mileageDelta = latestOdometer - tire.installed_odo;

  let status = "good";
  let message: string = ui.trackers.tyre.health.healthy;

  if (ageInYears >= MAX_AGE_YEARS || mileageDelta >= MAX_MILEAGE) {
    status = "danger";
    message =
      ageInYears >= MAX_AGE_YEARS
        ? `>${MAX_AGE_YEARS} yrs old`
        : ui.trackers.tyre.health.wornOut;
  } else if (ageInYears >= 5 || mileageDelta >= 40000) {
    status = "warning";
    message = ui.trackers.tyre.health.inspectSoon;
  }

  if (tire.tread_depth !== undefined) {
    if (tire.tread_depth <= 2) {
      status = "danger";
      message = ui.trackers.tyre.health.lowTread;
    } else if (tire.tread_depth <= 4) {
      if (status === "good") status = "warning";
      message = ui.trackers.tyre.health.wornTread;
    }
  }

  return { status, age: ageInYears, mileage: mileageDelta, message };
}

export function TyreTrackerWidget({
  vehicle,
  latestOdometer,
}: {
  vehicle: VehicleWithLogs;
  latestOdometer: number;
}) {
  const { fetchVehicles } = useVehicleStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [applyTarget, setApplyTarget] = useState<ApplyTarget>("ALL");
  const [installDate, setInstallDate] = useState<Date | undefined>(new Date());
  const [selectedWheel, setSelectedWheel] = useState<WheelPos | null>(null);

  const tyreInfo = vehicle.tyre_info;

  const isMoto = vehicle.vehicle_type === "motorcycle";

  const tires = useMemo(() => {
    const legacyTire: TireItem | undefined =
      tyreInfo &&
      tyreInfo.brand &&
      tyreInfo.installed_date &&
      tyreInfo.installed_odo
        ? {
            brand: tyreInfo.brand,
            installed_date: tyreInfo.installed_date,
            installed_odo: tyreInfo.installed_odo,
            dot_code: tyreInfo.dot_code,
          }
        : undefined;

    let mappedTires: Partial<Record<WheelPos, TireItem | undefined>> = {};
    if (isMoto) {
      // For motorcycles, front_left = Front, rear_left = Rear (repurposing DB fields)
      mappedTires = {
        F: tyreInfo?.front_left || legacyTire,
        R: tyreInfo?.rear_left || legacyTire,
      };
    } else {
      mappedTires = {
        FL: tyreInfo?.front_left || legacyTire,
        FR: tyreInfo?.front_right || legacyTire,
        RL: tyreInfo?.rear_left || legacyTire,
        RR: tyreInfo?.rear_right || legacyTire,
      };
    }
    return mappedTires;
  }, [tyreInfo, isMoto]);

  const hasAnyTires = Object.values(tires).some((t) => t !== undefined);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const treadRaw = formData.get("tread_depth") as string;

    const newTire: TireItem = {
      brand: formData.get("brand") as string,
      installed_date: formData.get("installed_date") as string,
      installed_odo: parseInt(formData.get("installed_odo") as string, 10),
      dot_code: (formData.get("dot_code") as string) || undefined,
      tread_depth: treadRaw ? parseFloat(treadRaw) : undefined,
    };

    // Merge with existing tyreInfo
    const updatedTyreInfo: TyreInfo = { ...tyreInfo };

    if (applyTarget === "ALL") {
      if (isMoto) {
        updatedTyreInfo.front_left = newTire; // Front
        updatedTyreInfo.rear_left = newTire; // Rear
      } else {
        updatedTyreInfo.front_left = newTire;
        updatedTyreInfo.front_right = newTire;
        updatedTyreInfo.rear_left = newTire;
        updatedTyreInfo.rear_right = newTire;
      }
    } else if (applyTarget === "FRONT") {
      if (isMoto) updatedTyreInfo.front_left = newTire;
      else {
        updatedTyreInfo.front_left = newTire;
        updatedTyreInfo.front_right = newTire;
      }
    } else if (applyTarget === "REAR") {
      if (isMoto) updatedTyreInfo.rear_left = newTire;
      else {
        updatedTyreInfo.rear_left = newTire;
        updatedTyreInfo.rear_right = newTire;
      }
    } else if (applyTarget === "FL" || applyTarget === "F")
      updatedTyreInfo.front_left = newTire;
    else if (applyTarget === "FR") updatedTyreInfo.front_right = newTire;
    else if (applyTarget === "RL" || applyTarget === "R")
      updatedTyreInfo.rear_left = newTire;
    else if (applyTarget === "RR") updatedTyreInfo.rear_right = newTire;

    // Remove legacy flat fields since we migrated to the new schema
    delete updatedTyreInfo.brand;
    delete updatedTyreInfo.installed_date;
    delete updatedTyreInfo.installed_odo;
    delete updatedTyreInfo.dot_code;

    const updateData = new FormData();
    updateData.append("tyre_info", JSON.stringify(updatedTyreInfo));

    startTransition(async () => {
      const result = await updateVehicle(vehicle.id, updateData);

      if (!result.error) {
        fetchVehicles();
        setOpenDialog(false);
        setInstallDate(new Date());
        setSelectedWheel(null);
      }
    });
  }

  return (
    <Card className="rounded-[2rem] shadow-sm border overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 border-b">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center">
            <div className="bg-slate-500/10 text-slate-600 p-1.5 rounded-md mr-3 shadow-sm border border-black/5">
              <Disc className="h-5 w-5" />
            </div>
            {ui.trackers.tyre.title}
          </CardTitle>
          <CardDescription>{ui.trackers.tyre.description}</CardDescription>
        </div>
        {hasAnyTires && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs rounded-full"
              >
                {ui.trackers.tyre.updateTires}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
              <DialogHeader>
                <DialogTitle>{ui.trackers.tyre.updateTires}</DialogTitle>
                <DialogDescription>
                  {ui.trackers.tyre.updateTiresDescription}
                </DialogDescription>
              </DialogHeader>
              <TireForm
                onSubmit={onSubmit}
                isSaving={isPending}
                installDate={installDate}
                setInstallDate={setInstallDate}
                applyTarget={applyTarget}
                setApplyTarget={setApplyTarget}
                latestOdometer={latestOdometer}
                isMoto={isMoto}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {!hasAnyTires ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Disc className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground w-3/4 mb-4">
              {ui.trackers.tyre.noTireInfo}
            </p>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full shadow-sm text-slate-600 border-slate-200"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  {ui.trackers.tyre.addTires}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle>{ui.trackers.tyre.addTires}</DialogTitle>
                  <DialogDescription>
                    {ui.trackers.tyre.addTiresDescription}
                  </DialogDescription>
                </DialogHeader>
                <TireForm
                  onSubmit={onSubmit}
                  isSaving={isPending}
                  installDate={installDate}
                  setInstallDate={setInstallDate}
                  applyTarget={applyTarget}
                  setApplyTarget={setApplyTarget}
                  latestOdometer={latestOdometer}
                  isMoto={isMoto}
                />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 items-center justify-center w-full">
            {/* Horizontal Car Visualizer */}
            <div className="relative w-full max-w-xl h-[280px] bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-slate-800 dark:via-indigo-950/30 dark:to-slate-900 rounded-[3rem] border-[4px] border-white/50 dark:border-slate-700/50 shadow-xl flex items-center justify-center shrink-0 overflow-visible transition-colors mx-auto group/car">
              {/* Static Wheels Array */}
              {isMoto ? (
                <>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <WheelComponent
                      pos="F"
                      tire={tires.F}
                      isTop={true}
                      selectedWheel={selectedWheel}
                      setSelectedWheel={setSelectedWheel}
                      latestOdometer={latestOdometer}
                    />
                  </div>
                  <div className="absolute left-8 top-1/2 -translate-y-1/2">
                    <WheelComponent
                      pos="R"
                      tire={tires.R}
                      isTop={true}
                      selectedWheel={selectedWheel}
                      setSelectedWheel={setSelectedWheel}
                      latestOdometer={latestOdometer}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute left-6 xl:left-8 top-[-2.5rem]">
                    <WheelComponent
                      pos="RL"
                      tire={tires.RL}
                      isTop={true}
                      selectedWheel={selectedWheel}
                      setSelectedWheel={setSelectedWheel}
                      latestOdometer={latestOdometer}
                    />
                  </div>
                  <div className="absolute right-6 xl:right-8 top-[-2.5rem]">
                    <WheelComponent
                      pos="FL"
                      tire={tires.FL}
                      isTop={true}
                      selectedWheel={selectedWheel}
                      setSelectedWheel={setSelectedWheel}
                      latestOdometer={latestOdometer}
                    />
                  </div>
                  <div className="absolute left-6 xl:left-8 bottom-[-2.5rem]">
                    <WheelComponent
                      pos="RR"
                      tire={tires.RR}
                      isTop={false}
                      selectedWheel={selectedWheel}
                      setSelectedWheel={setSelectedWheel}
                      latestOdometer={latestOdometer}
                    />
                  </div>
                  <div className="absolute right-6 xl:right-8 bottom-[-2.5rem]">
                    <WheelComponent
                      pos="FR"
                      tire={tires.FR}
                      isTop={false}
                      selectedWheel={selectedWheel}
                      setSelectedWheel={setSelectedWheel}
                      latestOdometer={latestOdometer}
                    />
                  </div>
                </>
              )}

              {/* Mid-chassis visual */}
              <div className="absolute inset-y-16 inset-x-32 bg-white/40 dark:bg-black/20 rounded-3xl border border-white/60 dark:border-white/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] overflow-hidden backdrop-blur-md transition-all duration-500">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800/10 dark:text-white/5 tracking-[0.4em] uppercase whitespace-nowrap">
                  {vehicle.make}
                </span>
              </div>
            </div>

            {/* Details Panel */}
            <div className="flex-1 w-full max-w-md h-[280px]">
              {selectedWheel ? (
                <div className="bg-muted/30 p-6 rounded-3xl border border-black/5 dark:border-white/5 dark:bg-white/5 shadow-md relative animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 h-6 text-xs px-2"
                    onClick={() => setSelectedWheel(null)}
                  >
                    {ui.common.actions.close}
                  </Button>
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    {ui.trackers.tyre.wheelTitle(
                      selectedWheel === "FL"
                        ? ui.trackers.tyre.positions.FL
                        : selectedWheel === "FR"
                          ? ui.trackers.tyre.positions.FR
                          : selectedWheel === "RL"
                            ? ui.trackers.tyre.positions.RL
                            : selectedWheel === "RR"
                              ? ui.trackers.tyre.positions.RR
                              : selectedWheel === "F"
                                ? ui.trackers.tyre.positions.F
                                : ui.trackers.tyre.positions.R,
                    )}
                  </h4>

                  {tires[selectedWheel] ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">
                          {ui.trackers.tyre.brandAndModel}
                        </p>
                        <p className="font-medium">
                          {tires[selectedWheel]?.brand}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">
                            {ui.trackers.tyre.ageDot}
                          </p>
                          <p className="font-medium text-sm">
                            {calculateHealth(
                              tires[selectedWheel],
                              latestOdometer,
                            ).age.toFixed(1)}{" "}
                            yrs
                            {tires[selectedWheel]?.dot_code && (
                              <span className="text-muted-foreground ml-1">
                                ({tires[selectedWheel]?.dot_code})
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">
                            {ui.trackers.tyre.distanceDriven}
                          </p>
                          <p className="font-medium text-sm">
                            {calculateHealth(
                              tires[selectedWheel],
                              latestOdometer,
                            ).mileage.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">
                            {ui.trackers.tyre.treadDepth}
                          </p>
                          <p className="font-medium text-sm">
                            {tires[selectedWheel]?.tread_depth
                              ? `${tires[selectedWheel]?.tread_depth} mm`
                              : ui.trackers.tyre.notRecorded}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">
                            {ui.trackers.tyre.status}
                          </p>
                          <p
                            className={cn(
                              "font-bold text-sm",
                              calculateHealth(
                                tires[selectedWheel],
                                latestOdometer,
                              ).status === "good"
                                ? "text-green-600"
                                : calculateHealth(
                                      tires[selectedWheel],
                                      latestOdometer,
                                    ).status === "warning"
                                  ? "text-amber-500"
                                  : "text-red-500",
                            )}
                          >
                            {
                              calculateHealth(
                                tires[selectedWheel],
                                latestOdometer,
                              ).message
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-8 text-center italic">
                      {ui.trackers.tyre.noTireForPosition}
                    </p>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/10 rounded-3xl border border-dashed border-black/10 dark:border-white/10 dark:bg-white/5">
                  <Disc className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="font-medium text-foreground">
                    {ui.trackers.tyre.interactiveMapTitle}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ui.trackers.tyre.interactiveMapDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function WheelComponent({
  pos,
  tire,
  isTop,
  selectedWheel,
  setSelectedWheel,
  latestOdometer,
}: {
  pos: WheelPos;
  tire: TireItem | undefined;
  isTop: boolean;
  selectedWheel: WheelPos | null;
  setSelectedWheel: (pos: WheelPos) => void;
  latestOdometer: number;
}) {
  const health = calculateHealth(tire, latestOdometer);

  let colorClass = "bg-slate-500/80 border-slate-400/50";
  if (health.status === "good")
    colorClass =
      "bg-emerald-400 border-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.7)] text-white";
  if (health.status === "warning")
    colorClass =
      "bg-amber-400 border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.8)] text-black";
  if (health.status === "danger")
    colorClass =
      "bg-rose-500 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.8)] text-white";

  return (
    <div
      className={cn(
        "relative w-24 h-32 group cursor-pointer transition-all duration-300 flex flex-col items-center",
        selectedWheel === pos ? "scale-110 z-10" : "hover:scale-105 hover:z-10",
      )}
      onClick={() => setSelectedWheel(pos)}
    >
      {/* 1. Static Wheel */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-20 h-10 rounded-xl border-[3px] overflow-hidden flex items-center justify-center transition-colors shadow-xl",
          colorClass,
        )}
      >
        <div className="absolute inset-0 opacity-[0.25] bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,#000_4px,#000_8px)]"></div>
        {/* Shadow for 3D effect */}
        <div className="absolute inset-x-0 w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
      </div>

      {/* 2. Fixed Position Label */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 text-[13px] font-black tracking-widest drop-shadow-md text-slate-500 dark:text-slate-400",
          isTop ? "top-1" : "bottom-1",
        )}
      >
        {pos}
      </div>

      {/* 3. Fixed Detail Pill */}
      {tire && (
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 text-[11px] font-bold px-3 py-1 rounded-full bg-background/95 text-foreground border shadow-lg truncate min-w-[70px] text-center backdrop-blur-md",
            isTop ? "bottom-0" : "top-0",
          )}
        >
          {tire.tread_depth ? `${tire.tread_depth} mm` : health.message}
        </div>
      )}
    </div>
  );
}

// Extracted form to reduce nesting and duplication
interface TireFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  installDate: Date | undefined;
  setInstallDate: (date: Date) => void;
  applyTarget: ApplyTarget;
  setApplyTarget: (target: ApplyTarget) => void;
  latestOdometer: number;
  isMoto: boolean;
}
function TireForm({
  onSubmit,
  isSaving,
  installDate,
  setInstallDate,
  applyTarget,
  setApplyTarget,
  latestOdometer,
  isMoto,
}: TireFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label>{ui.trackers.tyre.applyTo}</Label>
        <Select value={applyTarget} onValueChange={setApplyTarget}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder={ui.trackers.tyre.selectWheels} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {isMoto ? (
              <>
                <SelectItem value="ALL">
                  {ui.trackers.tyre.bothWheels}
                </SelectItem>
                <SelectItem value="F">{ui.trackers.tyre.frontOnly}</SelectItem>
                <SelectItem value="R">{ui.trackers.tyre.rearOnly}</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="ALL">
                  {ui.trackers.tyre.allFourWheels}
                </SelectItem>
                <SelectItem value="FRONT">
                  {ui.trackers.tyre.frontPairOnly}
                </SelectItem>
                <SelectItem value="REAR">
                  {ui.trackers.tyre.rearPairOnly}
                </SelectItem>
                <SelectItem value="FL">
                  {ui.trackers.tyre.frontLeftOnly}
                </SelectItem>
                <SelectItem value="FR">
                  {ui.trackers.tyre.frontRightOnly}
                </SelectItem>
                <SelectItem value="RL">
                  {ui.trackers.tyre.rearLeftOnly}
                </SelectItem>
                <SelectItem value="RR">
                  {ui.trackers.tyre.rearRightOnly}
                </SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="brand">{ui.trackers.tyre.brandModelLabel}</Label>
        <Input
          id="brand"
          name="brand"
          placeholder={ui.trackers.tyre.brandModelPlaceholder}
          required
          className="rounded-xl"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dot_code">{ui.trackers.tyre.dotOptional}</Label>
          <Input
            id="dot_code"
            name="dot_code"
            placeholder={ui.trackers.tyre.dotPlaceholder}
            maxLength={4}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tread_depth">{ui.trackers.tyre.treadMm}</Label>
          <Input
            type="number"
            step="0.1"
            id="tread_depth"
            name="tread_depth"
            placeholder={ui.trackers.tyre.treadPlaceholder}
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="space-y-2 flex flex-col">
        <Label>{ui.trackers.tyre.installationDate}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal rounded-xl",
                !installDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {installDate ? (
                format(installDate, "PPP")
              ) : (
                <span>{ui.trackers.tyre.pickDate}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={installDate}
              onSelect={(date) => date && setInstallDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <input
          type="hidden"
          name="installed_date"
          value={installDate ? installDate.toISOString() : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="installed_odo">
          {ui.trackers.tyre.odometerAtInstall}
        </Label>
        <Input
          type="number"
          id="installed_odo"
          name="installed_odo"
          required
          className="rounded-xl"
          defaultValue={latestOdometer}
        />
      </div>
      <Button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-full h-12 mt-2 text-base font-semibold shadow-md active:scale-[0.98] transition-all"
      >
        {isSaving ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          ui.trackers.tyre.saveTireData
        )}
      </Button>
    </form>
  );
}
