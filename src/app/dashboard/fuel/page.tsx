"use client";

import { useVehicleStore } from "@/store/vehicle-store";
import { useUserStore } from "@/store/user-store";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Fuel, DollarSign, Activity, Settings2, Pencil, Trash2 } from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { FuelLogModal } from "@/components/fuel-log-modal";
import { FuelEditModal } from "@/components/fuel-edit-modal";
import { FuelDeleteDialog } from "@/components/fuel-delete-dialog";
import { PageHeader } from "@/components/page-header";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type FuelEfficiencyUnit = 'km/L' | 'L/100km' | 'MPG (US)' | 'MPG (UK)';
const METRIC_OPTIONS: FuelEfficiencyUnit[] = ['km/L', 'L/100km', 'MPG (US)', 'MPG (UK)'];

export default function FuelPage() {
    const { selectedVehicleId, vehicles } = useVehicleStore();
    const { profile, getVolumeUnit } = useUserStore();

    const [selectedMetric, setSelectedMetric] = useState<FuelEfficiencyUnit | null>(null);
    const [editingLog, setEditingLog] = useState<{ id: string; vehicle_id: string; date: string; odometer: number; fuel_volume: number; total_cost: number; estimated_range?: number | null; energy_type?: string; calcEff: number } | null>(null);
    const [deletingLog, setDeletingLog] = useState<{ id: string; vehicle_id: string; date: string } | null>(null);

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

    if (!selectedVehicle) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">No Vehicle Selected</h2>
                    <p className="text-muted-foreground">Select a vehicle from the top nav to analyze fuel data.</p>
                </div>
            </div>
        );
    }

    const logs = selectedVehicle.fuel_logs?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
    const hasLogs = logs.length > 0;

    const volUnit = getVolumeUnit();
    const defaultMetric = profile.distanceUnit === 'km' && volUnit.includes('Liter') ? 'km/L' :
        volUnit.includes('UK') ? 'MPG (UK)' : 'MPG (US)';
    const activeMetric = selectedMetric || defaultMetric;

    // Helper to calculate runtime multi-metric efficiency
    const computeEfficiency = (distanceDelta: number, volumeDelta: number, targetMetric: FuelEfficiencyUnit) => {
        if (!distanceDelta || !volumeDelta || distanceDelta <= 0) return 0;

        let distanceKm = distanceDelta;
        if (profile.distanceUnit === 'miles') distanceKm = distanceDelta * 1.60934;

        let volumeLiters = volumeDelta;
        if (volUnit === 'Gallons') volumeLiters = volumeDelta * 3.78541;
        else if (volUnit.includes('UK')) volumeLiters = volumeDelta * 4.54609;

        switch (targetMetric) {
            case 'km/L': return distanceKm / volumeLiters;
            case 'L/100km': return (volumeLiters / distanceKm) * 100;
            case 'MPG (US)': return (distanceKm * 0.621371) / (volumeLiters * 0.264172);
            case 'MPG (UK)': return (distanceKm * 0.621371) / (volumeLiters * 0.219969);
            default: return 0;
        }
    };

    // --- Analytics Calculations ---
    let avgEfficiency = 0;
    let avgCostPerDistance = 0;

    // Sort logic requires distance delta computation for proper timeline logging
    const logsWithDelta = logs.map((log, index) => {
        const distDelta = index > 0 ? log.odometer - logs[index - 1].odometer : 0;
        const calcEff = computeEfficiency(distDelta, log.fuel_volume, activeMetric);
        return { ...log, distDelta, calcEff };
    });

    const tableLogs = [...logsWithDelta].reverse();

    // Prepare chart data using dynamically calculated efficiencies
    const chartData = logsWithDelta.map((log) => {
        return {
            date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            efficiency: Number(log.calcEff.toFixed(2)),
            cost: Number(log.total_cost.toFixed(2)),
            volume: Number(log.fuel_volume.toFixed(2)),
            range: log.estimated_range ? Number(log.estimated_range) : null,
            rawDate: log.date
        };
    }).filter(d => d.efficiency > 0 || (d.range !== null && d.range > 0));

    const hasRangeData = chartData.some(d => d.range !== null && d.range > 0);

    if (logs.length > 1) {
        let totalDistance = 0;
        let totalVolume = 0;
        let totalCost = 0;

        for (let i = 1; i < logs.length; i++) {
            const distance = logs[i].odometer - logs[i - 1].odometer;
            if (distance > 0) {
                totalDistance += distance;
                totalVolume += logs[i].fuel_volume;
                totalCost += logs[i].total_cost;
            }
        }

        if (totalDistance > 0 && totalVolume > 0) {
            avgEfficiency = computeEfficiency(totalDistance, totalVolume, activeMetric);
            avgCostPerDistance = totalCost / totalDistance;
        }
    }

    const efficiencyUnit = activeMetric;
    const numberFormat = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formatCurrency = (val: number) => `${profile.currency || '$'}${numberFormat.format(val)}`;

    return (
        <MotionWrapper className="max-w-6xl mx-auto space-y-6">
            <PageHeader
                title="Fuel Analysis"
                description={`Metrics & history for your ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}.`}
                icon={Fuel}
            >
                <FuelLogModal vehicle={selectedVehicle} />
            </PageHeader>

            {!hasLogs ? (
                <MotionWrapper delay={0.1}>
                    <Card className="bg-white/5 border-dashed border-2 border-white/10">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                            <Fuel className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-semibold tracking-tight">No fuel data yet</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm">
                                Log your first fill-up to unlock efficiency metrics, cost charts, and historical analysis.
                            </p>
                        </CardContent>
                    </Card>
                </MotionWrapper>
            ) : (
                <>
                    {/* Vitals Row */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <MotionWrapper delay={0.1}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Efficiency</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-emerald-500" />
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="focus:outline-none hover:bg-white/10 p-1 rounded-md transition-colors">
                                                <Settings2 className="h-4 w-4 text-muted-foreground hover:text-white" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border border-white/10 bg-veloce-bg backdrop-blur-xl shadow-2xl">
                                                {METRIC_OPTIONS.map((metric) => (
                                                    <DropdownMenuItem
                                                        key={metric}
                                                        onClick={() => setSelectedMetric(metric)}
                                                        className={`cursor-pointer focus:bg-white/10 ${activeMetric === metric ? 'font-bold bg-white/5' : ''}`}
                                                    >
                                                        {metric}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-emerald-500 shadow-emerald-500/20 drop-shadow-md">
                                        {avgEfficiency > 0 ? avgEfficiency.toFixed(2) : '--'}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">{efficiencyUnit}</p>
                                </CardContent>
                            </Card>
                        </MotionWrapper>

                        <MotionWrapper delay={0.2}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Cost per {profile.distanceUnit.toUpperCase()}</CardTitle>
                                    <DollarSign className="h-4 w-4 text-rose-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-rose-500 shadow-rose-500/20 drop-shadow-md">
                                        {avgCostPerDistance > 0 ? formatCurrency(avgCostPerDistance) : '--'}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">Average running cost</p>
                                </CardContent>
                            </Card>
                        </MotionWrapper>

                        <MotionWrapper delay={0.3} className="md:col-span-2 lg:col-span-1">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Logs</CardTitle>
                                    <Fuel className="h-4 w-4 text-blue-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-blue-500 shadow-blue-500/20 drop-shadow-md">
                                        {logs.length}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">Fill-ups recorded</p>
                                </CardContent>
                            </Card>
                        </MotionWrapper>
                    </div>

                    {/* Charts Row */}
                    {chartData.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2">
                            <MotionWrapper delay={0.4}>
                                <Card className="h-full overflow-hidden">
                                    <CardHeader className="border-b border-white/5">
                                        <CardTitle>Efficiency Trend</CardTitle>
                                        <CardDescription>Fuel efficiency over your recent fill-ups.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[250px] w-full pt-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff20" />
                                                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#e2e8f0', fontSize: 12 }} />
                                                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#e2e8f0', fontSize: 12 }} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(10px)' }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="efficiency"
                                                    stroke="#10b981"
                                                    strokeWidth={3}
                                                    dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#030712" }}
                                                    activeDot={{ r: 6 }}
                                                    name={efficiencyUnit}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </MotionWrapper>

                            <MotionWrapper delay={0.5}>
                                <Card className="h-full overflow-hidden">
                                    <CardHeader className="border-b border-white/5">
                                        <CardTitle>Cost vs Volume</CardTitle>
                                        <CardDescription>Track the financial impact of each visit.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
                                                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="cost"
                                                    stackId="1"
                                                    stroke="#f43f5e"
                                                    fill="#f43f5e"
                                                    fillOpacity={0.2}
                                                    strokeWidth={2}
                                                    name={`Cost (${profile.currency})`}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </MotionWrapper>
                        </div>
                    )}

                    {hasRangeData && (
                        <MotionWrapper delay={0.6}>
                                <Card className="overflow-hidden">
                                    <CardHeader className="border-b border-white/5">
                                        <CardTitle>Battery Range Trend</CardTitle>
                                        <CardDescription>Track your EV&apos;s estimated battery range over time.</CardDescription>
                                    </CardHeader>
                                <CardContent className="h-[250px] w-full pt-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData.filter(d => d.range !== null)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff20" />
                                            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#e2e8f0', fontSize: 12 }} />
                                            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#e2e8f0', fontSize: 12 }} domain={['dataMin - 10', 'dataMax + 10']} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(10px)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="range"
                                                stroke="#3b82f6"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#030712" }}
                                                activeDot={{ r: 6 }}
                                                name={`Range (${profile.distanceUnit})`}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </MotionWrapper>
                    )}

                    {/* Data Table */}
                    <Card className="rounded-[2rem] shadow-sm overflow-hidden border">
                        <CardHeader className="bg-muted/20 border-b pb-4">
                            <CardTitle>Fill-Up History</CardTitle>
                            <CardDescription>Detailed log of all recorded fuel transactions.</CardDescription>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/10 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium text-right">Odometer</th>
                                        <th className="px-6 py-4 font-medium text-right">Volume</th>
                                        <th className="px-6 py-4 font-medium text-right">Cost</th>
                                        <th className="px-6 py-4 font-medium text-right">Efficiency</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {tableLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium">
                                                {new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {log.odometer.toLocaleString()} <span className="text-muted-foreground text-xs">{profile.distanceUnit}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {log.fuel_volume.toLocaleString()} <span className="text-muted-foreground text-xs">{getVolumeUnit()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-rose-600 dark:text-rose-400">
                                                {formatCurrency(log.total_cost)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                {log.calcEff ? `${log.calcEff.toFixed(2)}` : '--'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors"
                                                        onClick={() => setEditingLog(log)}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                        onClick={() => setDeletingLog(log)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            )}

            {/* Edit Modal */}
            {editingLog && (
                <FuelEditModal
                    log={editingLog}
                    open={!!editingLog}
                    onOpenChange={(open) => { if (!open) setEditingLog(null); }}
                />
            )}

            {/* Delete Dialog */}
            {deletingLog && (
                <FuelDeleteDialog
                    logId={deletingLog.id}
                    vehicleId={deletingLog.vehicle_id}
                    logDate={new Date(deletingLog.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    open={!!deletingLog}
                    onOpenChange={(open) => { if (!open) setDeletingLog(null); }}
                />
            )}
        </MotionWrapper>
    );
}
