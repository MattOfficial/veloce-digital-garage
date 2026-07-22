"use client";

import { BarChart3, Coins, Route } from "lucide-react";

import { MotionWrapper } from "@/components/motion-wrapper";
import { PageHeader } from "@/components/page-header";
import { CostTrendsPanel } from "@/components/trends/cost-trends-panel";
import { DistanceTrendsPanel } from "@/components/trends/distance-trends-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ui } from "@/content/en/ui";
import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import { getCurrencySymbol } from "@/utils/formatting";

export default function TrendsPage() {
  const { vehicles, selectedVehicleId } = useVehicleStore();
  const { profile } = useUserStore();
  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicleId,
  );

  if (!selectedVehicle) {
    return (
      <div className="grid min-h-[50vh] place-items-center px-6 text-center">
        <div>
          <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold">
            {ui.insights.noVehicleSelectedTitle}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {ui.insights.noVehicleSelectedDescription}
          </p>
        </div>
      </div>
    );
  }

  const vehicleLabel = `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`;
  const currencySymbol = getCurrencySymbol(profile.currency);

  return (
    <MotionWrapper className="mx-auto w-full max-w-7xl min-w-0 space-y-6 px-0 pb-12 sm:px-4">
      <PageHeader
        title={ui.insights.pageTitle}
        description={ui.insights.pageDescription(vehicleLabel)}
        icon={BarChart3}
        className="mb-2"
      />

      <Tabs defaultValue="costs" className="min-w-0 space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl border border-border/60 bg-muted/45 p-1.5 sm:w-[380px]">
          <TabsTrigger
            value="costs"
            className="gap-2 rounded-xl py-2.5 data-[state=active]:shadow-sm"
          >
            <Coins className="h-4 w-4" />
            {ui.insights.tabs.runningCosts}
          </TabsTrigger>
          <TabsTrigger
            value="distance"
            className="gap-2 rounded-xl py-2.5 data-[state=active]:shadow-sm"
          >
            <Route className="h-4 w-4" />
            {ui.insights.tabs.distance}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="costs" className="min-w-0">
          <CostTrendsPanel
            vehicle={selectedVehicle}
            currencySymbol={currencySymbol}
            distanceUnit={profile.distanceUnit}
          />
        </TabsContent>

        <TabsContent value="distance" className="min-w-0">
          <DistanceTrendsPanel
            vehicle={selectedVehicle}
            distanceUnit={profile.distanceUnit}
          />
        </TabsContent>
      </Tabs>
    </MotionWrapper>
  );
}
