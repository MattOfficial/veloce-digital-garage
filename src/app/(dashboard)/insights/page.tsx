"use client";

import { useVehicleStore } from "@/store/vehicle-store";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { BarChart2 } from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";

import { useUserStore } from "@/store/user-store";

export default function InsightsPage() {
    const { vehicles, selectedVehicleId } = useVehicleStore();
    const { profile, getFuelEconomyUnit } = useUserStore();

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

    const fuelEconomyUnit = getFuelEconomyUnit();

    const chartConfig = useMemo(() => ({
        efficiency: {
            label: `Efficiency (${fuelEconomyUnit})`,
            color: "var(--chart-1)",
        },
        cost: {
            label: `Cost (${profile.currency})`,
            color: "var(--chart-2)",
        },
        distance: {
            label: `Distance (${profile.distanceUnit})`,
            color: "var(--chart-3)",
        }
    } satisfies ChartConfig), [profile.currency, profile.distanceUnit, fuelEconomyUnit]);

    // Process data for charts
    const { efficiencyData, costPerKmData, monthlyData } = useMemo(() => {
        if (!selectedVehicle || !selectedVehicle.fuel_logs) {
            return { efficiencyData: [], costPerKmData: [], monthlyData: [] };
        }

        // Sort logs by date ascending
        const sortedLogs = [...selectedVehicle.fuel_logs].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // 1. Efficiency Data
        const mappedEfficiency = sortedLogs
            .filter((log) => log.calculated_efficiency !== null)
            .map((log) => ({
                date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                efficiency: log.calculated_efficiency,
            }));

        // 2. Cost Per Km Data
        // Requires distance, so we look at distance driven vs cost of fuel.
        let previousOdometer = selectedVehicle.baseline_odometer;
        const mappedCostPerKm = sortedLogs.map((log) => {
            const distance = log.odometer - previousOdometer;
            const costPerKm = distance > 0 ? log.total_cost / distance : 0;
            previousOdometer = log.odometer; // update for next iteration

            return {
                date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                costPerKm: parseFloat(costPerKm.toFixed(2)),
            };
        });

        // 3. Monthly Aggregate (Cost & Distance)
        const monthlyMap = new Map<string, { month: string; distance: number; cost: number }>();
        previousOdometer = selectedVehicle.baseline_odometer;

        sortedLogs.forEach((log) => {
            const monthYear = new Date(log.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            const distance = log.odometer - previousOdometer;
            previousOdometer = log.odometer;

            if (!monthlyMap.has(monthYear)) {
                monthlyMap.set(monthYear, { month: monthYear, distance: 0, cost: 0 });
            }

            const current = monthlyMap.get(monthYear)!;
            current.distance += distance;
            current.cost += log.total_cost;
        });

        return {
            efficiencyData: mappedEfficiency,
            costPerKmData: mappedCostPerKm,
            monthlyData: Array.from(monthlyMap.values()),
        };
    }, [selectedVehicle]);

    if (!selectedVehicle) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">No Vehicle Selected</h2>
                    <p className="text-muted-foreground">Select a vehicle to view insights.</p>
                </div>
            </div>
        );
    }

    // If there are no logs, show empty state
    if (selectedVehicle.fuel_logs.length === 0) {
        return (
            <MotionWrapper className="max-w-6xl mx-auto space-y-6 px-4">
                <div className="flex flex-col gap-2 bg-primary/5 p-8 rounded-[2rem] border-none shadow-sm mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 text-primary">
                        <BarChart2 className="h-10 w-10" />
                        Performance Pulse
                    </h1>
                </div>
                <div className="text-center py-20 border-none shadow-md rounded-[2rem] bg-card/50 backdrop-blur-sm">
                    <h2 className="text-xl font-medium">Not enough data</h2>
                    <p className="text-muted-foreground mt-1">Please log some fill-ups to see insights and graphs.</p>
                </div>
            </MotionWrapper>
        )
    }

    return (
        <MotionWrapper className="max-w-6xl mx-auto space-y-8 pb-10 px-4">
            <div className="flex flex-col gap-2 bg-gradient-to-br from-primary/10 to-blue-500/5 p-8 rounded-[2rem] border-none shadow-sm mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 text-primary">
                    <BarChart2 className="h-10 w-10" />
                    Performance Pulse
                </h1>
                <p className="text-muted-foreground text-lg ml-1">
                    Deep dive into the performance of your {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Efficiency Curve */}
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-blue-50/70 dark:bg-blue-950/30">
                    <CardHeader className="pb-2 pt-6">
                        <CardTitle className="text-xl text-blue-900 dark:text-blue-200">Fuel Efficiency Trend</CardTitle>
                        <CardDescription className="text-base text-blue-700/70 dark:text-blue-300/70">{getFuelEconomyUnit()} over time</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <AreaChart data={efficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="fillEfficiency" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-efficiency)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-efficiency)" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area
                                    type="monotone"
                                    dataKey="efficiency"
                                    stroke="var(--color-efficiency)"
                                    fillOpacity={1}
                                    fill="url(#fillEfficiency)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Cost per Distance */}
                <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-emerald-50/70 dark:bg-emerald-950/30">
                    <CardHeader className="pb-2 pt-6">
                        <CardTitle className="text-xl text-emerald-900 dark:text-emerald-200">Cost Per {profile.distanceUnit === 'km' ? 'Kilometer' : 'Mile'}</CardTitle>
                        <CardDescription className="text-base text-emerald-700/70 dark:text-emerald-300/70">Running cost efficiency ({profile.currency}/{profile.distanceUnit})</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <LineChart data={costPerKmData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="step"
                                    dataKey="costPerKm"
                                    stroke="var(--color-cost)"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Monthly Aggregate */}
                <Card className="md:col-span-2 rounded-[2rem] border-none shadow-sm overflow-hidden bg-purple-50/70 dark:bg-purple-950/30">
                    <CardHeader className="pb-2 pt-6">
                        <CardTitle className="text-xl text-purple-900 dark:text-purple-200">Monthly Overview</CardTitle>
                        <CardDescription className="text-base text-purple-700/70 dark:text-purple-300/70">Distance driven and total amount spent</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                                <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickMargin={8} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar yAxisId="left" dataKey="distance" fill="var(--color-distance)" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="right" dataKey="cost" fill="var(--color-cost)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </MotionWrapper>
    );
}
