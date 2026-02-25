"use client";

import { useVehicleStore } from "@/store/vehicle-store";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ArrowRight, Droplet, Wrench, Activity, CalendarDays, TrendingUp, Sparkles, Droplets, PaintBucket, Receipt, Map as MapIcon, Zap, Battery, Car, Umbrella, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useUserStore } from "@/store/user-store";

import { CustomLogCategory } from "@/types/database";

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444']; // Blue, Amber, Emerald, Red

const ICON_MAP: Record<string, React.ElementType> = {
    Sparkles, Droplets, PaintBucket, Receipt, Wrench, Map: MapIcon, Zap, Battery, Car, Umbrella
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

export default function DashboardClient({ categories = [] }: { categories?: CustomLogCategory[] }) {
    const { vehicles, isLoading } = useVehicleStore();
    const { profile } = useUserStore();
    const selectedVehicle = useVehicleStore((state) => state.getSelectedVehicle());

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!selectedVehicle || vehicles.length === 0) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold mb-2">No Vehicles Found</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Please add a vehicle to your garage to view the dashboard and analytics.
                    </p>
                    <Link href="/profile">
                        <Button className="rounded-full">Go to Profile</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const currencySymbol = profile?.currency === "USD" ? "$" : profile?.currency === "EUR" ? "€" : profile?.currency === "GBP" ? "£" : "₹";
    const distanceUnit = profile?.distanceUnit || "km";

    // 1. Calculate Vitals
    const totalFuelCost = selectedVehicle.fuel_logs?.reduce((sum, log) => sum + log.total_cost, 0) || 0;
    const totalMaintenanceCost = selectedVehicle.maintenance_logs?.reduce((sum, log) => sum + log.cost, 0) || 0;
    const totalCustomCost = selectedVehicle.custom_logs?.reduce((sum, log) => sum + (log.cost || 0), 0) || 0;
    const totalSpend = totalFuelCost + totalMaintenanceCost + totalCustomCost;

    const latestOdometer = selectedVehicle.fuel_logs && selectedVehicle.fuel_logs.length > 0
        ? Math.max(...selectedVehicle.fuel_logs.map(l => l.odometer))
        : selectedVehicle.baseline_odometer;

    // Last 30 days spend vs previous 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

    const getCostInPeriod = (startDate: Date, endDate: Date) => {
        const fCost = selectedVehicle.fuel_logs?.filter(l => new Date(l.date) >= startDate && new Date(l.date) < endDate).reduce((sum, l) => sum + l.total_cost, 0) || 0;
        const mCost = selectedVehicle.maintenance_logs?.filter(l => new Date(l.date) >= startDate && new Date(l.date) < endDate).reduce((sum, l) => sum + l.cost, 0) || 0;
        const cCost = selectedVehicle.custom_logs?.filter(l => new Date(l.date) >= startDate && new Date(l.date) < endDate).reduce((sum, l) => sum + (l.cost || 0), 0) || 0;
        return fCost + mCost + cCost;
    };

    const costLast30Days = getCostInPeriod(thirtyDaysAgo, now);
    const costPrev30Days = getCostInPeriod(sixtyDaysAgo, thirtyDaysAgo);

    let spendTrend = 0;
    if (costPrev30Days > 0) {
        spendTrend = ((costLast30Days - costPrev30Days) / costPrev30Days) * 100;
    }

    // 2. Prepare Data for Charts
    const expenseData = [
        { name: 'Fuel', value: totalFuelCost },
        { name: 'Maintenance', value: totalMaintenanceCost }
    ];
    if (totalCustomCost > 0) expenseData.push({ name: 'Other', value: totalCustomCost });

    // Aggregate cost data by month for the bar chart (last 6 months)
    const costOverTimeMap = new Map<string, { month: string, Fuel: number, Maintenance: number }>();
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthYear = d.toLocaleDateString('default', { month: 'short', year: '2-digit' });
        costOverTimeMap.set(monthYear, { month: monthYear, Fuel: 0, Maintenance: 0 });
    }

    selectedVehicle.fuel_logs?.forEach(log => {
        const d = new Date(log.date);
        const monthYear = d.toLocaleDateString('default', { month: 'short', year: '2-digit' });
        if (costOverTimeMap.has(monthYear)) {
            costOverTimeMap.get(monthYear)!.Fuel += log.total_cost;
        }
    });

    selectedVehicle.maintenance_logs?.forEach(log => {
        const d = new Date(log.date);
        const monthYear = d.toLocaleDateString('default', { month: 'short', year: '2-digit' });
        if (costOverTimeMap.has(monthYear)) {
            costOverTimeMap.get(monthYear)!.Maintenance += log.cost;
        }
    });

    const costOverTimeData = Array.from(costOverTimeMap.values());

    // 3. Recent Activity (Latest 5 logs combined)
    const allLogs = [
        ...(selectedVehicle.fuel_logs?.map(l => ({ ...l, type: 'Fuel', sortDate: new Date(l.date).getTime() })) || []),
        ...(selectedVehicle.maintenance_logs?.map(l => ({ ...l, type: 'Maintenance', sortDate: new Date(l.date).getTime() })) || []),
        ...(selectedVehicle.custom_logs?.map(l => ({ ...l, type: `Other`, sortDate: new Date(l.date).getTime() })) || [])
    ].sort((a, b) => b.sortDate - a.sortDate).slice(0, 5);


    return (
        <MotionWrapper className="space-y-8 max-w-6xl mx-auto pb-12">

            {/* Header Area with Profile Link */}
            <PageHeader
                title="Overview"
                description={`Tracking analytics and insights for your ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}.`}
                icon={LayoutDashboard}
            >
                <Link href={`/vehicles/${selectedVehicle.id}`}>
                    <Button variant="outline" className="rounded-full shadow-sm hover:bg-primary/5 hover:text-primary transition-colors border-primary/20">
                        View Full Vehicle Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </PageHeader>

            {/* Top Vitals Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MotionWrapper delay={0.1}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Current Odometer</CardTitle>
                            <Activity className="h-4 w-4 text-primary opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{latestOdometer.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {distanceUnit} on the clock
                            </p>
                        </CardContent>
                    </Card>
                </MotionWrapper>

                <MotionWrapper delay={0.2}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">30-Day Spend</CardTitle>
                            <CalendarDays className="h-4 w-4 text-emerald-500 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{currencySymbol}{costLast30Days.toFixed(2)}</div>
                            <p className={`text-xs mt-1 flex items-center ${spendTrend > 0 ? 'text-destructive' : spendTrend < 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                {spendTrend > 0 ? '↑' : spendTrend < 0 ? '↓' : ''} {Math.abs(spendTrend).toFixed(1)}% vs previous 30 days
                            </p>
                        </CardContent>
                    </Card>
                </MotionWrapper>

                <MotionWrapper delay={0.3}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Lifetime Fuel</CardTitle>
                            <Droplet className="h-4 w-4 text-amber-500 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{currencySymbol}{totalFuelCost.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                All time fuel cost
                            </p>
                        </CardContent>
                    </Card>
                </MotionWrapper>

                <MotionWrapper delay={0.4}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Lifetime Maintenance</CardTitle>
                            <Wrench className="h-4 w-4 text-blue-500 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{currencySymbol}{totalMaintenanceCost.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                All time repair cost
                            </p>
                        </CardContent>
                    </Card>
                </MotionWrapper>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* 6-Month Expense History Chart */}
                <MotionWrapper delay={0.5} className="lg:col-span-4">
                    <Card className="overflow-hidden h-full">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                                6-Month Expense History
                            </CardTitle>
                            <CardDescription>Track your spending trends over half a year.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[300px] w-full pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={costOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${currencySymbol}${value}`} />
                                        <Tooltip
                                            cursor={{ fill: 'var(--color-veloce-glass)' }}
                                            contentStyle={{ borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(10px)' }}
                                            formatter={(value: number) => [`${currencySymbol}${value.toFixed(2)}`, undefined]}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                        <Bar dataKey="Fuel" stackId="a" fill={COLORS[1]} radius={[0, 0, 4, 4]} />
                                        <Bar dataKey="Maintenance" stackId="a" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </MotionWrapper>

                {/* Expense Distribution Pie Chart */}
                <MotionWrapper delay={0.6} className="lg:col-span-3">
                    <Card className="h-full overflow-hidden">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle>Expense Distribution</CardTitle>
                            <CardDescription>Lifetime spending breakdown by category.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {totalSpend > 0 ? (
                                <div className="h-[300px] w-full pt-4 flex flex-col items-center justify-center relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={expenseData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {expenseData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: number) => [`${currencySymbol}${value.toFixed(2)}`, undefined]}
                                                contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Center Label */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 text-center">
                                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mb-1">Total</span>
                                        <span className="text-xl font-bold">{currencySymbol}{(totalSpend / 1000).toFixed(1)}k</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center">
                                    <p className="text-muted-foreground text-sm">No expenses logged yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </MotionWrapper>
            </div>

            {/* Bottom Row - Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
                <MotionWrapper delay={0.7} className="md:col-span-2 lg:col-span-1">
                    <Card className="h-full overflow-hidden">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>The last 5 events recorded for your vehicle.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {allLogs.length > 0 ? (
                                <div className="divide-y max-h-[350px] overflow-y-auto">
                                    {allLogs.map((log, i) => {
                                        type LogUnion = typeof log & {
                                            category_id?: string;
                                            service_type?: string;
                                            fuel_volume?: number;
                                            gallons?: number;
                                            odometer?: number;
                                            notes?: string;
                                            cost?: number;
                                            total_cost?: number;
                                        };

                                        const ulog = log as LogUnion;

                                        const cat = ulog.type === 'Other' ? categories.find(c => c.id === ulog.category_id) : null;
                                        const IconComponent = ulog.type === 'Fuel' ? Droplet :
                                            ulog.type === 'Maintenance' ? Wrench :
                                                cat && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : Activity;

                                        const themeColor = ulog.type === 'Other' && cat ? getColorHex(cat.color_theme) : null;

                                        return (
                                            <div key={`${ulog.type}-${i}`} className="p-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                                                <div className={`p-2 rounded-full mt-0.5 shrink-0 ${ulog.type === 'Fuel' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                                                    ulog.type === 'Maintenance' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                                                        (!themeColor ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : '')
                                                    }`}
                                                    style={themeColor ? { backgroundColor: `${themeColor}20`, color: themeColor } : undefined}>
                                                    <IconComponent className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-medium leading-none">
                                                            {ulog.type === 'Fuel' ? 'Refueled' :
                                                                ulog.type === 'Maintenance' ? ulog.service_type :
                                                                    cat ? cat.name : 'Custom Entry'}
                                                        </p>
                                                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap ml-2">
                                                            {new Date(ulog.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {ulog.type === 'Fuel' ? `${ulog.fuel_volume || ulog.gallons || ''} units added at ${ulog.odometer} ${distanceUnit}` :
                                                            ulog.type === 'Maintenance' ? ulog.notes || 'Maintenance logged' :
                                                                ulog.notes || 'Entry logged'}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-semibold text-right flex items-center justify-end">
                                                    {ulog.type === 'Other' && cat && !cat.track_cost ? null :
                                                        ulog.cost != null ? `${currencySymbol}${Number(ulog.cost).toFixed(2)}` :
                                                            ulog.total_cost != null ? `${currencySymbol}${Number(ulog.total_cost).toFixed(2)}` : ''}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-muted/5 min-h-[250px] flex flex-col items-center justify-center">
                                    <Activity className="h-8 w-8 text-muted-foreground/50 mb-3" />
                                    <p className="text-sm text-muted-foreground">No recent activity found. Log your first fill-up or service!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </MotionWrapper>

                {/* Quick Actions Card */}
                <MotionWrapper delay={0.8} className="md:col-span-2 lg:col-span-1">
                    <Card className="h-full overflow-hidden bg-gradient-to-br from-primary/10 to-transparent">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Add new records to your vehicle without leaving the dashboard.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <Link href="/fuel" className="block w-full">
                                <Button className="w-full justify-start h-14 rounded-xl text-md" variant="default">
                                    <div className="bg-primary-foreground/20 p-2 rounded-lg mr-3">
                                        <Droplet className="h-5 w-5" />
                                    </div>
                                    Log a Fill-up
                                </Button>
                            </Link>
                            {/* We will add a wrapper to open the maintenance modal from here later if needed, for now we will link to the maintenance tab or the vehicle view */}
                            <Link href={`/vehicles/${selectedVehicle.id}`} className="block w-full">
                                <Button className="w-full justify-start h-14 rounded-xl text-md" variant="outline">
                                    <div className="bg-muted p-2 rounded-lg mr-3">
                                        <Wrench className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    Add Maintenance Record
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </MotionWrapper>
            </div>

        </MotionWrapper>
    );
}
