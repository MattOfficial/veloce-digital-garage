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
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { BarChart2 } from "lucide-react";

const chartConfig = {
    efficiency: {
        label: "Efficiency (km/L)",
        color: "hsl(var(--chart-1))",
    },
    cost: {
        label: "Cost (£)",
        color: "hsl(var(--chart-2))",
    },
    distance: {
        label: "Distance (km)",
        color: "hsl(var(--chart-3))",
    }
} satisfies ChartConfig;

export default function InsightsPage() {
    const { vehicles, selectedVehicleId } = useVehicleStore();

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

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
            <div className="max-w-5xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <BarChart2 className="h-8 w-8 text-primary" />
                    Analytics Engine
                </h1>
                <div className="text-center py-20 border rounded-xl bg-card">
                    <h2 className="text-xl font-medium">Not enough data</h2>
                    <p className="text-muted-foreground mt-1">Please log some fill-ups to see insights and graphs.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <BarChart2 className="h-8 w-8 text-primary" />
                    Analytics Engine
                </h1>
                <p className="text-muted-foreground mt-2">
                    Deep dive into the performance of your {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Efficiency Curve */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fuel Efficiency Trend</CardTitle>
                        <CardDescription>Kilometers per liter over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <AreaChart data={efficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="fillEfficiency" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-efficiency)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-efficiency)" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
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

                {/* Cost per Km */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cost Per Kilometer</CardTitle>
                        <CardDescription>Running cost efficiency (£/km)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <LineChart data={costPerKmData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Monthly Overview</CardTitle>
                        <CardDescription>Distance driven and total amount spent</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
        </div>
    );
}
