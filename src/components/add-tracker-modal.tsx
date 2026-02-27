"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Droplets, Wrench, Sparkles, Receipt, Map, Zap, Battery, Car, PaintBucket, Umbrella } from "lucide-react";
import { createTrackerCategory } from "@/app/actions/custom-trackers";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { useVehicleStore } from "@/store/vehicle-store";
import { useRouter } from "next/navigation";

const ICONS = [
    { name: "Sparkles", icon: Sparkles },
    { name: "Droplets", icon: Droplets },
    { name: "PaintBucket", icon: PaintBucket },
    { name: "Receipt", icon: Receipt },
    { name: "Wrench", icon: Wrench },
    { name: "Map", icon: Map },
    { name: "Zap", icon: Zap },
    { name: "Battery", icon: Battery },
    { name: "Car", icon: Car },
    { name: "Umbrella", icon: Umbrella },
];

const COLORS = [
    { name: "Blue", value: "blue" },
    { name: "Emerald", value: "emerald" },
    { name: "Violet", value: "violet" },
    { name: "Rose", value: "rose" },
    { name: "Amber", value: "amber" },
    { name: "Slate", value: "slate" }
];

export function AddTrackerModal({ onTrackerAdded }: { onTrackerAdded?: () => void }) {
    const { fetchVehicles, selectedVehicleId } = useVehicleStore();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
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
                setMessage({ type: 'error', text: result.error });
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
        <Dialog open={open} onOpenChange={(newOpen) => {
            if (!newOpen) setMessage(null);
            setOpen(newOpen);
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-dashed border-2 bg-muted/20 hover:bg-muted/50 rounded-2xl h-full min-h-[140px] flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 w-full group">
                    <div className="bg-background rounded-full p-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Plus className="h-6 w-6" />
                    </div>
                    <span className="font-medium tracking-tight">Create Custom Tracker</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl">New Custom Tracker</DialogTitle>
                    <DialogDescription>
                        Build a custom widget to track events on your vehicles.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 pt-4">
                    <input type="hidden" name="vehicle_id" value={selectedVehicleId || ""} />
                    <div className="space-y-2">
                        <Label htmlFor="name">Tracker Name</Label>
                        <Input id="name" name="name" placeholder="e.g. Car Washes, Detailing, Tolls" className="rounded-xl" required />
                    </div>

                    <div className="space-y-3">
                        <Label>Select Icon</Label>
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
                                                    className={`p-3 rounded-xl transition-all duration-200 border-2 ${isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-muted/50 hover:bg-muted text-muted-foreground'}`}
                                                >
                                                    <IconComponent className="h-5 w-5" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" className="rounded-xl px-3 py-1.5 text-xs font-semibold">
                                                {ico.name}
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </TooltipProvider>
                    </div>

                    <div className="space-y-3">
                        <Label>Color Theme</Label>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map((c) => {
                                const isSelected = selectedColor === c.value;
                                return (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setSelectedColor(c.value)}
                                        className={`w-10 h-10 rounded-full transition-all duration-300 cursor-pointer border-[3px] flex items-center justify-center ${isSelected ? 'border-foreground shadow-sm scale-110' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: `var(--${c.value}-500, ${getColorHex(c.value)})` }}
                                        title={c.name}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <div className="space-y-0.5">
                            <Label htmlFor="track_cost" className="text-base">Track Cost</Label>
                            <p className="text-sm text-muted-foreground">Log monetary expenses along with this event?</p>
                        </div>
                        <Switch id="track_cost" name="track_cost" value="true" defaultChecked />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-emerald-500/15 text-emerald-600'}`}>
                            {message.text}
                        </div>
                    )}

                    <Button type="submit" disabled={isPending} className="w-full rounded-full h-12 text-base font-semibold shadow-md active:scale-[0.98] transition-all">
                        {isPending ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Tracker...</>
                        ) : (
                            "Build Tracker"
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
        slate: "#64748b"
    };
    return map[color] || "#64748b";
}
