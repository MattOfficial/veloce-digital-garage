"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomLog, CustomLogCategory } from "@/types/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Droplets, PaintBucket, Receipt, Wrench, Map, Zap, Battery, Car, Umbrella, Plus, Loader2 } from "lucide-react";
import { addCustomLog } from "@/app/actions/custom-trackers";
import { useUserStore } from "@/store/user-store";

const ICON_MAP: Record<string, React.ElementType> = {
    Sparkles, Droplets, PaintBucket, Receipt, Wrench, Map, Zap, Battery, Car, Umbrella
};

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

export function CustomTrackerWidget({
    category,
    logs,
    vehicleId
}: {
    category: CustomLogCategory;
    logs: CustomLog[];
    vehicleId: string;
}) {
    const router = useRouter();
    const { profile } = useUserStore();
    const currencySymbol = profile.currency === "USD" ? "$" : profile.currency === "EUR" ? "€" : profile.currency === "GBP" ? "£" : "₹";

    const [openDialog, setOpenDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const IconComponent = ICON_MAP[category.icon] || Wrench;
    const themeColor = getColorHex(category.color_theme);

    async function onSubmitLog(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        formData.append("vehicle_id", vehicleId);
        formData.append("category_id", category.id);

        const result = await addCustomLog(formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setOpenDialog(false);
            setMessage(null);
            router.refresh();
        }
        setIsSaving(false);
    }

    // Sort logs descending by date
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <Card className="rounded-[2rem] shadow-sm border overflow-hidden h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 border-b">
                <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center">
                        <div
                            className="bg-primary/10 p-1.5 rounded-md mr-3 shadow-sm border border-black/5"
                            style={{ backgroundColor: `${themeColor}20`, color: themeColor, borderColor: `${themeColor}40` }}
                        >
                            <IconComponent className="h-5 w-5" />
                        </div>
                        {category.name}
                    </CardTitle>
                    <CardDescription>Track timeline events for {category.name.toLowerCase()}.</CardDescription>
                </div>

                <Dialog open={openDialog} onOpenChange={(o) => { if (!o) setMessage(null); setOpenDialog(o); }}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full shadow-sm" style={{ color: themeColor, borderColor: `${themeColor}50` }}>
                            <Plus className="h-4 w-4 mr-1.5" />
                            Log Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                        <DialogHeader>
                            <DialogTitle>Log New: {category.name}</DialogTitle>
                            <DialogDescription>Add a new entry to this tracker's timeline.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={onSubmitLog} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input type="date" id="date" name="date" required className="rounded-xl" defaultValue={new Date().toISOString().split('T')[0]} />
                            </div>

                            {category.track_cost && (
                                <div className="space-y-2">
                                    <Label htmlFor="cost">Total Cost ({currencySymbol})</Label>
                                    <Input type="number" id="cost" name="cost" step="0.01" min="0" placeholder="0.00" className="rounded-xl" />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes & Details (Optional)</Label>
                                <Textarea id="notes" name="notes" placeholder="Any specific details about this event..." className="rounded-xl min-h-[100px]" />
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-emerald-500/15 text-emerald-600'}`}>
                                    {message.text}
                                </div>
                            )}

                            <Button type="submit" disabled={isSaving} className="w-full rounded-full h-12 text-base font-semibold shadow-md active:scale-[0.98] transition-all" style={{ backgroundColor: themeColor, color: '#fff' }}>
                                {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Save Log"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
                {sortedLogs.length > 0 ? (
                    <div className="overflow-x-auto flex-1">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow className="border-b/50 hover:bg-transparent">
                                    <TableHead className="w-[120px] font-semibold text-muted-foreground pl-6">Date</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground w-1/2">Notes</TableHead>
                                    {category.track_cost && (
                                        <TableHead className="text-right font-semibold text-muted-foreground pr-6">Cost</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedLogs.map((log) => (
                                    <TableRow key={log.id} className="group hover:bg-muted/20 transition-colors">
                                        <TableCell className="font-medium pl-6 text-foreground/80 whitespace-nowrap">
                                            {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground/90 text-sm">
                                            {log.notes || <span className="italic opacity-50">No details provided</span>}
                                        </TableCell>
                                        {category.track_cost && (
                                            <TableCell className="text-right font-semibold pr-6 text-foreground/90">
                                                {log.cost !== null ? `${currencySymbol}${log.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/5 flex-1 min-h-[200px]">
                        <div
                            className="p-4 rounded-full mb-4 shadow-sm border border-black/5 opacity-50"
                            style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                        >
                            <IconComponent className="h-8 w-8" />
                        </div>
                        <h3 className="text-base font-semibold tracking-tight text-foreground/80">No entries yet</h3>
                        <p className="text-muted-foreground text-sm max-w-[250px] mt-1 mb-5">
                            Start tracking events for your {category.name.toLowerCase()} here.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
