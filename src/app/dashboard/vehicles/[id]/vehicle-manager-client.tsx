"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VehicleWithLogs } from "@/types/database";
import { useUserStore } from "@/store/user-store";
import { updateVehicle } from "@/app/actions/vehicles";
import { upsertVehicleServiceInterval } from "@/app/actions/reminders";
import { useVehicleStore } from "@/store/vehicle-store";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Save, Car, Droplet, Wrench, Calendar, Gauge, History, Edit3, X } from "lucide-react";
import { AddMaintenanceModal } from "@/components/add-maintenance-modal";
import { UpdateOdometerModal } from "@/components/update-odometer-modal";
import { ui } from "@/content/en/ui";
import { getServiceReminderStatus, getVehicleCurrentOdometer, getVehicleServiceInterval } from "@/utils/vehicle-metrics";
import { toast } from "sonner";

export function VehicleManagerClient({ vehicle: initialVehicle }: { vehicle: VehicleWithLogs }) {
    const router = useRouter();
    const { profile } = useUserStore();
    const { fetchVehicles, selectedVehicleId, setSelectedVehicleId } = useVehicleStore();
    const [vehicle, setVehicle] = useState(initialVehicle);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingServiceInterval, setIsSavingServiceInterval] = useState(false);
    const [isEditingSpecs, setIsEditingSpecs] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [customFields, setCustomFields] = useState<{ key: string, value: string }[]>([]);


    // Sync global selected vehicle to this page's vehicle if it doesn't match
    useEffect(() => {
        if (selectedVehicleId !== initialVehicle.id) {
            setSelectedVehicleId(initialVehicle.id);
        }
    }, [initialVehicle.id, selectedVehicleId, setSelectedVehicleId]);



    // Calculate Vitals
    const totalFuelCost = vehicle.fuel_logs.reduce((sum, log) => sum + log.total_cost, 0);
    const totalMaintenanceCost = vehicle.maintenance_logs.reduce((sum, log) => sum + log.cost, 0);
    const latestOdometer = getVehicleCurrentOdometer(vehicle);
    const serviceInterval = getVehicleServiceInterval(vehicle.service_reminders);
    const serviceIntervalStatus = serviceInterval ? getServiceReminderStatus(serviceInterval, latestOdometer) : null;

    const currencySymbol = profile.currency === "USD" ? "$" : profile.currency === "EUR" ? "€" : profile.currency === "GBP" ? "£" : "₹";

    async function handleUpdateSpecs(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);

        // Convert customFields array back to object and append to formData
        const customFieldsObj = customFields.reduce((acc, curr) => {
            if (curr.key.trim() !== '') {
                acc[curr.key.trim()] = curr.value.trim();
            }
            return acc;
        }, {} as Record<string, string>);
        formData.append("custom_fields", JSON.stringify(customFieldsObj));

        const result = await updateVehicle(vehicle.id, formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else if (result.vehicle) {
            setMessage({ type: 'success', text: ui.vehicle.updatedSpecifications });
            setVehicle({ ...vehicle, ...result.vehicle });
            // Re-fetch global vehicles so the profile page is updated too
            fetchVehicles();
            setIsEditingSpecs(false);
        }
        setIsSaving(false);
    }

    async function handleSaveServiceInterval(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSavingServiceInterval(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        formData.append("vehicle_id", vehicle.id);

        try {
            const result = await upsertVehicleServiceInterval(formData);
            if (result.reminder) {
                const existing = vehicle.service_reminders.filter((reminder) => reminder.id !== result.reminder.id);
                setVehicle({ ...vehicle, service_reminders: [result.reminder, ...existing] });
            }
            await fetchVehicles();
            router.refresh();
            toast.success(ui.vehicle.serviceIntervalSaved);
        } catch (error) {
            const messageText = error instanceof Error ? error.message : "Failed to update service interval.";
            setMessage({ type: "error", text: messageText });
        } finally {
            setIsSavingServiceInterval(false);
        }
    }



    return (
        <MotionWrapper className="space-y-6 pb-20">
            {/* Header / Hero Section */}
            <div className="relative -mt-6 -mx-4 md:-mx-8 px-4 md:px-8 pt-8 pb-16 bg-muted overflow-hidden flex flex-col justify-end min-h-[300px] border-b">
                {vehicle.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={vehicle.image_url}
                        alt={ui.vehicle.heroAlt}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/5 text-primary/20">
                        <Car className="h-40 w-40" />
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

                <div className="relative z-10 space-y-4">
                    <button onClick={() => router.back()} className="inline-flex items-center text-sm font-semibold text-primary-foreground bg-primary/95 hover:bg-primary shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 mb-4 px-5 py-2.5 rounded-full w-fit">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {ui.vehicle.back}
                    </button>

                    <div>
                        <div className="flex items-center gap-3 text-primary text-sm font-bold tracking-wider uppercase mb-2">
                            <div className="bg-primary/20 text-primary px-3 py-1 rounded-full">{vehicle.year}</div>
                            {vehicle.engine_type && <div className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full">{vehicle.engine_type}</div>}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground/90 mix-blend-plus-darker dark:mix-blend-screen drop-shadow-sm">
                            {vehicle.make} {vehicle.model}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-3 md:-mt-12 relative z-20">

                {/* Vitals Sidebar */}
                <div className="space-y-6 md:col-span-1">
                    <Card className="rounded-[2rem] shadow-lg border-primary/10 overflow-hidden bg-card/60 backdrop-blur-xl">
                        <CardHeader className="bg-primary/5 border-b">
                            <CardTitle className="text-lg flex items-center">
                                <Gauge className="h-5 w-5 mr-2 text-primary" />
                                {ui.vehicle.vitalsTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 divide-y">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span className="text-sm font-medium">{ui.vehicle.added}</span>
                                </div>
                                <span className="font-semibold">{new Date(vehicle.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center text-muted-foreground">
                                    <Gauge className="h-4 w-4 mr-2" />
                                    <span className="text-sm font-medium">{ui.vehicle.odometer}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold">{latestOdometer.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{profile.distanceUnit}</span></span>
                                    <UpdateOdometerModal
                                        vehicleId={vehicle.id}
                                        currentOdometer={latestOdometer}
                                        onUpdated={(nextOdometer) => setVehicle((current) => ({ ...current, current_odometer: nextOdometer }))}
                                        trigger={<Button variant="outline" size="sm" className="rounded-full px-3">{ui.common.actions.update}</Button>}
                                    />
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center text-muted-foreground">
                                    <Droplet className="h-4 w-4 mr-2" />
                                    <span className="text-sm font-medium">{ui.vehicle.fuelTotal}</span>
                                </div>
                                <span className="font-semibold">{currencySymbol}{totalFuelCost.toFixed(2)}</span>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center text-muted-foreground">
                                    <Wrench className="h-4 w-4 mr-2" />
                                    <span className="text-sm font-medium">{ui.vehicle.maintenanceTotal}</span>
                                </div>
                                <span className="font-semibold">{currencySymbol}{totalMaintenanceCost.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Specs Form */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="rounded-[2rem] shadow-sm border overflow-hidden">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle>{ui.vehicle.specsTitle}</CardTitle>
                                <CardDescription>{ui.vehicle.specsDescription}</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    const nextEditingState = !isEditingSpecs;
                                    setIsEditingSpecs(nextEditingState);
                                    setMessage(null);
                                    if (nextEditingState) {
                                        setCustomFields(Object.entries(vehicle.custom_fields || {}).map(([key, value]) => ({ key, value: value as string })));
                                    }
                                }}
                                className="h-8 rounded-full px-3 text-muted-foreground hover:text-primary transition-colors"
                            >
                                {isEditingSpecs ? (
                                    <>
                                        <X className="h-4 w-4 mr-1.5" />
                                        {ui.common.actions.cancel}
                                    </>
                                ) : (
                                    <>
                                        <Edit3 className="h-4 w-4 mr-1.5" />
                                        {ui.common.actions.edit}
                                    </>
                                )}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {isEditingSpecs ? (
                                <form onSubmit={handleUpdateSpecs} className="space-y-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nickname">{ui.vehicle.nickname}</Label>
                                            <Input id="nickname" name="nickname" defaultValue={vehicle.nickname || ""} placeholder={ui.vehicle.nicknamePlaceholder} className="rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="vin">{ui.vehicle.vin}</Label>
                                            <Input id="vin" name="vin" defaultValue={vehicle.vin || ""} placeholder={ui.vehicle.vinPlaceholder} className="rounded-xl font-mono uppercase" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="license_plate">{ui.vehicle.licensePlate}</Label>
                                            <Input id="license_plate" name="license_plate" defaultValue={vehicle.license_plate || ""} placeholder={ui.vehicle.licensePlatePlaceholder} className="rounded-xl uppercase font-mono" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="color">{ui.vehicle.exteriorColor}</Label>
                                            <Input id="color" name="color" defaultValue={vehicle.color || ""} placeholder={ui.vehicle.exteriorColorPlaceholder} className="rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="engine_type">{ui.vehicle.engineType}</Label>
                                            <Input id="engine_type" name="engine_type" defaultValue={vehicle.engine_type || ""} placeholder={ui.vehicle.engineTypePlaceholder} className="rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="transmission">{ui.vehicle.transmission}</Label>
                                            <Input id="transmission" name="transmission" defaultValue={vehicle.transmission || ""} placeholder={ui.vehicle.transmissionPlaceholder} className="rounded-xl" />
                                        </div>
                                        {/* Make/Model/Year/Odometer hidden here if they aren't edited, but let's allow basic edits */}
                                        <div className="space-y-2">
                                            <Label htmlFor="year">{ui.vehicle.modelYear}</Label>
                                            <Input id="year" name="year" type="number" defaultValue={vehicle.year} className="rounded-xl" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="current_odometer">{ui.vehicle.currentOdometer}</Label>
                                            <Input
                                                id="current_odometer"
                                                name="current_odometer"
                                                type="number"
                                                min="0"
                                                step="any"
                                                defaultValue={vehicle.current_odometer ?? latestOdometer}
                                                placeholder={ui.vehicle.currentOdometerPlaceholder}
                                                className="rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">{ui.vehicle.importantNotes}</Label>
                                        <Textarea
                                            id="notes"
                                            name="notes"
                                            defaultValue={vehicle.notes || ""}
                                            placeholder={ui.vehicle.notesPlaceholder}
                                            className="rounded-xl min-h-[120px]"
                                        />
                                    </div>

                                    {/* Custom Fields Section */}
                                    <div className="space-y-4 pt-4 border-t border-border/50">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-semibold">{ui.vehicle.customSpecifications}</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full h-8 px-3"
                                                onClick={() => setCustomFields([...customFields, { key: "", value: "" }])}
                                            >
                                                + {ui.vehicle.addField}
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            {customFields.map((field, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <Input
                                                        placeholder={ui.vehicle.customFieldKeyPlaceholder}
                                                        className="rounded-xl flex-1"
                                                        value={field.key}
                                                        onChange={(e) => {
                                                            const newFields = [...customFields];
                                                            newFields[index].key = e.target.value;
                                                            setCustomFields(newFields);
                                                        }}
                                                    />
                                                    <Input
                                                        placeholder={ui.vehicle.customFieldValuePlaceholder}
                                                        className="rounded-xl flex-1"
                                                        value={field.value}
                                                        onChange={(e) => {
                                                            const newFields = [...customFields];
                                                            newFields[index].value = e.target.value;
                                                            setCustomFields(newFields);
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0 rounded-full"
                                                        onClick={() => {
                                                            const newFields = [...customFields];
                                                            newFields.splice(index, 1);
                                                            setCustomFields(newFields);
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {customFields.length === 0 && (
                                                <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-xl text-center border border-dashed border-border/50">
                                                    {ui.vehicle.noCustomSpecifications}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {message && (
                                        <div className={`p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-emerald-500/15 text-emerald-600'}`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={isSaving} className="rounded-full px-8 shadow-md">
                                            {isSaving ? (
                                                <div className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2" />
                                            ) : (
                                                <Save className="h-4 w-4 mr-2" />
                                            )}
                                            {isSaving ? ui.vehicle.savingSpecifications : ui.vehicle.saveSpecifications}
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">{ui.vehicle.nickname}</p>
                                            <p className="font-medium text-foreground tracking-wide">{vehicle.nickname || ui.vehicle.emptyValue}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">{ui.vehicle.vin}</p>
                                            <p className="font-medium text-foreground uppercase tracking-wide">{vehicle.vin || ui.vehicle.emptyValue}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">{ui.vehicle.licensePlate}</p>
                                            <p className="font-medium text-foreground uppercase tracking-wide">{vehicle.license_plate || ui.vehicle.emptyValue}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">{ui.vehicle.exteriorColor}</p>
                                            <p className="font-medium text-foreground">{vehicle.color || ui.vehicle.emptyValue}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">{ui.vehicle.engineType}</p>
                                            <p className="font-medium text-foreground">{vehicle.engine_type || ui.vehicle.emptyValue}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">{ui.vehicle.transmission}</p>
                                            <p className="font-medium text-foreground">{vehicle.transmission || ui.vehicle.emptyValue}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">{ui.vehicle.modelYear}</p>
                                            <p className="font-medium text-foreground">{vehicle.year}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">{ui.vehicle.currentOdometer}</p>
                                            <p className="font-medium text-foreground">{latestOdometer.toLocaleString()} {profile.distanceUnit}</p>
                                        </div>
                                        {/* Render Custom Fields in Read-Only Mode */}
                                        {Object.entries(vehicle.custom_fields || {}).map(([key, value]) => (
                                            <div key={key} className="space-y-1">
                                                <p className="text-sm font-medium text-muted-foreground">{key}</p>
                                                <p className="font-medium text-foreground">{value as string}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {vehicle.notes && (
                                        <div className="space-y-2 pt-4 border-t border-border/50">
                                            <p className="text-sm font-medium text-muted-foreground">{ui.vehicle.importantNotes}</p>
                                            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/30">
                                                {vehicle.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] shadow-sm border overflow-hidden">
                        <CardHeader>
                            <CardTitle>{ui.vehicle.serviceIntervalTitle}</CardTitle>
                            <CardDescription>{ui.vehicle.serviceIntervalDescription}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveServiceInterval} className="space-y-5">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="recurring_months">{ui.vehicle.serviceIntervalMonths}</Label>
                                        <Input
                                            id="recurring_months"
                                            name="recurring_months"
                                            type="number"
                                            min="1"
                                            placeholder="12"
                                            defaultValue={serviceInterval?.recurring_months ?? ""}
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="recurring_distance">{ui.vehicle.serviceIntervalDistance(profile.distanceUnit)}</Label>
                                        <Input
                                            id="recurring_distance"
                                            name="recurring_distance"
                                            type="number"
                                            min="1"
                                            step="any"
                                            placeholder="10000"
                                            defaultValue={serviceInterval?.recurring_distance ?? ""}
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>

                                {serviceInterval && serviceIntervalStatus ? (
                                    <div className="rounded-xl border border-border/50 bg-muted/20 p-4 text-sm">
                                        <p className="font-medium text-foreground">
                                            {serviceIntervalStatus.status === "overdue"
                                                ? ui.maintenance.reminders.statusOverdue
                                                : serviceIntervalStatus.status === "due-soon"
                                                    ? ui.maintenance.reminders.statusDueSoon
                                                    : serviceIntervalStatus.status === "needs-baseline"
                                                        ? ui.maintenance.reminders.statusNeedsBaseline
                                                        : ui.maintenance.reminders.statusHealthy}
                                        </p>
                                        <p className="mt-1 text-muted-foreground">
                                            {serviceInterval.last_completed_date
                                                ? `${ui.vehicle.serviceIntervalLastService}: ${new Date(serviceInterval.last_completed_date).toLocaleDateString()}${serviceInterval.last_completed_odometer != null ? ` • ${serviceInterval.last_completed_odometer.toLocaleString()} ${profile.distanceUnit}` : ""}`
                                                : ui.vehicle.serviceIntervalNeedsServiceLog}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">{ui.vehicle.serviceIntervalEmpty}</p>
                                )}

                                {message && message.type === "error" ? (
                                    <div className="rounded-xl bg-destructive/15 p-4 text-sm text-destructive">
                                        {message.text}
                                    </div>
                                ) : null}

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isSavingServiceInterval} className="rounded-full px-6 shadow-md">
                                        {isSavingServiceInterval ? ui.common.actions.saving : ui.vehicle.serviceIntervalSave}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Service History Table Section */}
            <div className="relative z-20 mb-8">
                <Card className="rounded-[2rem] shadow-sm border overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 border-b">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center">
                                <History className="h-5 w-5 mr-2 text-primary" />
                                {ui.vehicle.serviceHistoryTitle}
                            </CardTitle>
                            <CardDescription>{ui.vehicle.serviceHistoryDescription}</CardDescription>
                        </div>
                        <AddMaintenanceModal vehicleId={vehicle.id} />
                    </CardHeader>
                    <CardContent className="p-0">
                        {vehicle.maintenance_logs && vehicle.maintenance_logs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/10">
                                        <TableRow className="border-b/50 hover:bg-transparent">
                                            <TableHead className="w-[120px] font-semibold text-muted-foreground pl-6">{ui.vehicle.columns.date}</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">{ui.vehicle.columns.serviceType}</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">{ui.vehicle.columns.odometer}</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground w-1/3">{ui.vehicle.columns.notes}</TableHead>
                                            <TableHead className="text-right font-semibold text-muted-foreground pr-6">{ui.vehicle.columns.cost}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vehicle.maintenance_logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log) => (
                                            <TableRow key={log.id} className="group hover:bg-muted/20 transition-colors">
                                                <TableCell className="font-medium pl-6 text-foreground/80">
                                                    {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-primary/10 text-primary p-1.5 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                                                            <Wrench className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="font-medium text-foreground/90">{log.service_type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground/80">
                                                    {log.odometer != null ? `${log.odometer.toLocaleString()} ${profile.distanceUnit}` : ui.vehicle.emptyValue}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground/80 italic text-sm">
                                                    {log.notes || ui.vehicle.emptyValue}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold pr-6 text-foreground/90">
                                                    {currencySymbol}{log.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/5 min-h-[250px]">
                                <div className="bg-primary/10 p-4 rounded-full mb-4 shadow-sm border border-primary/10">
                                    <Wrench className="h-8 w-8 text-primary/70" />
                                </div>
                                <h3 className="text-lg font-semibold tracking-tight text-foreground/90">{ui.vehicle.serviceHistoryEmptyTitle}</h3>
                                <p className="text-muted-foreground text-sm max-w-sm mt-1 mb-6">
                                    {ui.vehicle.serviceHistoryEmptyDescription}
                                </p>
                                <AddMaintenanceModal vehicleId={vehicle.id} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </MotionWrapper>
    );
}
