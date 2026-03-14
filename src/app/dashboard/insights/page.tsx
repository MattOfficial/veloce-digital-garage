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
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { BarChart2, TrendingDown, DollarSign, CalendarClock, Zap, Activity } from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { PageHeader } from "@/components/page-header";

import { useUserStore } from "@/store/user-store";
import { ui } from "@/content/en/ui";

export default function InsightsPage() {
    const { vehicles, selectedVehicleId } = useVehicleStore();
    const { profile } = useUserStore();

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

    const currencySymbol = profile.currency === "USD" ? "$" : profile.currency === "EUR" ? "€" : profile.currency === "GBP" ? "£" : "₹";
    const distUnit = profile.distanceUnit;

    const chartConfig = useMemo(() => ({
        fuel: {
            label: `Fuel (${currencySymbol})`,
            color: "var(--chart-1)",
        },
        maintenance: {
            label: `Maintenance (${currencySymbol})`,
            color: "var(--chart-2)",
        },
        custom: {
            label: `Custom Tracker (${currencySymbol})`,
            color: "var(--chart-3)",
        }
    } satisfies ChartConfig), [currencySymbol]);

    // Process data for charts
    const {
        totalCost,
        totalDistance,
        tcoPerDist,
        monthlyData,
        fuelLogsCount,
        totalDays,
        daysBetweenRefuels,
        avgDistancePerDay,
        projectedEmptyDate,
        runningCostPerDay
    } = useMemo(() => {
        if (!selectedVehicle) {
            return {
                totalCost: 0, totalDistance: 0, tcoPerDist: 0, monthlyData: [],
                fuelLogsCount: 0, firstLogDate: new Date(), lastLogDate: new Date(), totalDays: 0,
                daysBetweenRefuels: 0, avgDistancePerDay: 0, projectedEmptyDate: null, runningCostPerDay: 0
            };
        }

        const fuel = selectedVehicle.fuel_logs || [];
        const maint = selectedVehicle.maintenance_logs || [];
        const custom = selectedVehicle.custom_logs || [];

        // Distill all logs into a single flat array for easier date sorting
        const allLogs: { date: string, cost: number, type: 'fuel' | 'maintenance' | 'custom', odometer?: number }[] = [
            ...fuel.map(l => ({ date: l.date, cost: l.total_cost, type: 'fuel' as const, odometer: l.odometer })),
            ...maint.map(l => ({ date: l.date, cost: l.cost || 0, type: 'maintenance' as const, odometer: undefined })),
            ...custom.map(l => ({ date: l.date, cost: l.cost || 0, type: 'custom' as const, odometer: undefined })) // Custom logs don't strictly require odometer right now
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


        let tCost = 0;
        let minOdo = selectedVehicle.baseline_odometer;
        let maxOdo = selectedVehicle.baseline_odometer;

        const monthlyMap = new Map<string, { month: string; fuel: number; maintenance: number; custom: number }>();

        allLogs.forEach(log => {
            tCost += log.cost;
            if (log.odometer) {
                if (log.odometer > maxOdo) maxOdo = log.odometer;
                if (log.odometer < minOdo && minOdo === selectedVehicle.baseline_odometer) minOdo = log.odometer; // only update if we haven't found a real minimum yet
            }

            const monthYear = new Date(log.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            if (!monthlyMap.has(monthYear)) {
                monthlyMap.set(monthYear, { month: monthYear, fuel: 0, maintenance: 0, custom: 0 });
            }
            const current = monthlyMap.get(monthYear)!;
            current[log.type] += log.cost;
        });

        const tDist = Math.max(0, maxOdo - minOdo);
        const tco = tDist > 0 ? tCost / tDist : 0;

        // Predictive Modeling based purely on Fuel Logs (most consistent intervals)
        const sortedFuel = [...fuel].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let avgDistPerDay = 0;
        let daysRefuel = 0;
        let projEmpty: Date | null = null;
        let costDay = 0;
        let tDays = 0;
        let fDate = new Date();
        let lDate = new Date();

        if (sortedFuel.length > 1) {
            fDate = new Date(sortedFuel[0].date);
            lDate = new Date(sortedFuel[sortedFuel.length - 1].date);
            tDays = Math.max(1, Math.floor((lDate.getTime() - fDate.getTime()) / (1000 * 60 * 60 * 24)));

            avgDistPerDay = tDist / tDays;
            daysRefuel = tDays / (sortedFuel.length - 1);
            costDay = tCost / tDays;

            projEmpty = new Date(lDate);
            projEmpty.setDate(projEmpty.getDate() + Math.round(daysRefuel));
        }


        return {
            totalCost: tCost,
            totalDistance: tDist,
            tcoPerDist: tco,
            monthlyData: Array.from(monthlyMap.values()),
            fuelLogsCount: sortedFuel.length,
            totalDays: tDays,
            daysBetweenRefuels: daysRefuel,
            avgDistancePerDay: avgDistPerDay,
            projectedEmptyDate: projEmpty,
            runningCostPerDay: costDay
        };

    }, [selectedVehicle]);


    if (!selectedVehicle) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">{ui.insights.noVehicleSelectedTitle}</h2>
                    <p className="text-muted-foreground">{ui.insights.noVehicleSelectedDescription}</p>
                </div>
            </div>
        );
    }

    if (fuelLogsCount < 2) {
        return (
            <MotionWrapper className="max-w-6xl mx-auto space-y-6 px-4">
                <PageHeader
                    title={ui.insights.pageTitle}
                    description={ui.insights.pageDescriptionShort(`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`)}
                    icon={BarChart2}
                    className="mb-4"
                />
                <div className="text-center py-20 border-none shadow-md rounded-[2rem] bg-card/50 backdrop-blur-sm">
                    <h2 className="text-xl font-medium">{ui.insights.insufficientDataTitle}</h2>
                    <p className="text-muted-foreground mt-1">{ui.insights.insufficientDataDescription}</p>
                </div>
            </MotionWrapper>
        )
    }

    const numberFormat = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formatCurrency = (val: number) => `${currencySymbol}${numberFormat.format(val)}`;

    return (
        <MotionWrapper className="max-w-6xl mx-auto space-y-8 pb-10 px-4">
            <PageHeader
                title={ui.insights.pageTitle}
                description={ui.insights.pageDescription(`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`)}
                icon={BarChart2}
                className="mb-4"
            />

            {/* Top Level KPIs */}
            <div className="grid gap-4 md:grid-cols-3">
                <MotionWrapper delay={0.1}>
                    <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-indigo-500 to-blue-600 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <TrendingDown className="h-24 w-24 translate-x-4 -translate-y-4" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium opacity-90">{ui.insights.totalRunningCost}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black mb-1">{formatCurrency(tcoPerDist)} <span className="text-lg opacity-70 font-medium">/ {distUnit}</span></div>
                            <p className="text-sm opacity-80">
                                Based on {formatCurrency(totalCost)} spent over {totalDistance.toLocaleString()} {distUnit}.
                            </p>
                        </CardContent>
                    </Card>
                </MotionWrapper>

                <MotionWrapper delay={0.2}>
                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{ui.insights.dailyOperatingCost}</CardTitle>
                            <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-foreground">{formatCurrency(runningCostPerDay)} <span className="text-base font-medium text-muted-foreground">/ day</span></div>
                            <p className="text-xs text-muted-foreground mt-1">{ui.insights.dailyOperatingCostDescription}</p>
                        </CardContent>
                    </Card>
                </MotionWrapper>

                <MotionWrapper delay={0.3}>
                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{ui.insights.averageDailyDistance}</CardTitle>
                            <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                                <Activity className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-foreground">{Math.round(avgDistancePerDay)} <span className="text-base font-medium text-muted-foreground">{distUnit}</span></div>
                            <p className="text-xs text-muted-foreground mt-1">{ui.insights.averageDailyDistanceDescription}</p>
                        </CardContent>
                    </Card>
                </MotionWrapper>
            </div>


            <div className="grid gap-6 md:grid-cols-3">
                {/* Cost Breakdown over Time */}
                <MotionWrapper delay={0.4} className="md:col-span-2">
                    <Card className="h-full overflow-hidden">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle>{ui.insights.expenseBreakdownTitle}</CardTitle>
                            <CardDescription>{ui.insights.expenseBreakdownDescription}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
                                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                                    <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${currencySymbol}${v}`} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar yAxisId="left" dataKey="fuel" stackId="a" fill="var(--color-fuel)" radius={[0, 0, 4, 4]} />
                                    <Bar yAxisId="left" dataKey="maintenance" stackId="a" fill="var(--color-maintenance)" />
                                    <Bar yAxisId="left" dataKey="custom" stackId="a" fill="var(--color-custom)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </MotionWrapper>

                {/* Predictive Vitals */}
                <MotionWrapper delay={0.5}>
                    <Card className="h-full overflow-hidden flex flex-col">
                        <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                                {ui.insights.cadencePredictionsTitle}
                            </CardTitle>
                            <CardDescription>{ui.insights.cadencePredictionsDescription(totalDays)}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 p-6 flex flex-col justify-center space-y-8">

                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4" /> {ui.insights.refuelingFrequency}
                                </div>
                                <div className="text-xl font-semibold">Every {Math.round(daysBetweenRefuels)} days</div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    You typically visit a fuel station roughly every {Math.max(1, Math.round(daysBetweenRefuels / 7))} weeks.
                                </p>
                            </div>

                            <div className="h-px w-full bg-border/20" />

                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Activity className="h-4 w-4" /> {ui.insights.estimatedNextRefuel}
                                </div>
                                <div className="text-xl font-semibold text-primary">
                                    {projectedEmptyDate ? projectedEmptyDate.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' }) : ui.insights.unknownDate}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Based on your current driving cadence, you will likely need to refuel around this date.
                                </p>
                            </div>

                        </CardContent>
                    </Card>
                </MotionWrapper>
            </div>
        </MotionWrapper>
    );
}
