"use client";

import { useEffect, useState, useRef } from "react";
import { User, Save, Car, Trash2, PlusCircle } from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/avatar-upload";
import { updateProfile } from "./actions";
import { addVehicle, deleteVehicle } from "@/app/actions/vehicles";
import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const currencies = [
    { value: "₹", label: "Indian Rupee (₹)" },
    { value: "$", label: "US Dollar ($)" },
    { value: "£", label: "British Pound (£)" },
    { value: "€", label: "Euro (€)" },
    { value: "¥", label: "Japanese Yen (¥)" },
];

export default function ProfilePage() {
    const { profile, fetchProfile, updateProfileOptimistic, isLoading } = useUserStore();

    // We keep local state for formatting edits before save, initialized from the store
    const [displayName, setDisplayName] = useState(profile.displayName || "");
    const [currency, setCurrency] = useState(profile.currency || "₹");
    const [distanceUnit, setDistanceUnit] = useState<"km" | "miles">(profile.distanceUnit || "km");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatarUrl);

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Vehicle state
    const { vehicles, fetchVehicles, isLoading: isVehiclesLoading } = useVehicleStore();
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const [vehicleMessage, setVehicleMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const addFormRef = useRef<HTMLFormElement>(null);

    // Initial fetch to sync store if not already loaded, and set local state
    useEffect(() => {
        const initialize = async () => {
            await fetchProfile();
        };
        initialize();
    }, [fetchProfile]);

    // Resync local inputs when profile loads from network
    useEffect(() => {
        setDisplayName(profile.displayName || "");
        setCurrency(profile.currency || "₹");
        setDistanceUnit(profile.distanceUnit || "km");
        setAvatarUrl(profile.avatarUrl);
    }, [profile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("display_name", displayName);
        formData.append("currency", currency);
        formData.append("distance_unit", distanceUnit);
        if (avatarUrl) {
            formData.append("avatar_url", avatarUrl);
        }

        const result = await updateProfile(formData);

        if (result?.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: "Profile updated successfully!" });
        }
        setIsSaving(false);
    };

    const handleAvatarUpload = (url: string) => {
        setAvatarUrl(url);
        // We don't auto-save here, user must click Save Profile
        setMessage({ type: 'success', text: "Image uploaded! Don't forget to save." });
    };

    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addFormRef.current) return;

        setIsAddingVehicle(true);
        setVehicleMessage(null);

        const formData = new FormData(addFormRef.current);
        const result = await addVehicle(formData);

        if (result?.error) {
            setVehicleMessage({ type: 'error', text: result.error });
        } else {
            setVehicleMessage({ type: 'success', text: "Vehicle added successfully!" });
            setDialogOpen(false);
            fetchVehicles(); // Refresh global store
        }
        setIsAddingVehicle(false);
    };

    const handleDeleteVehicle = async (id: string) => {
        setIsDeletingId(id);
        setVehicleMessage(null);

        const result = await deleteVehicle(id);

        if (result?.error) {
            setVehicleMessage({ type: 'error', text: result.error });
        } else {
            setVehicleMessage({ type: 'success', text: "Vehicle deleted." });
            fetchVehicles(); // Refresh
        }
        setIsDeletingId(null);
    };

    return (
        <MotionWrapper className="max-w-3xl mx-auto space-y-8 pb-10 px-4">
            <div className="flex flex-col gap-2 bg-gradient-to-br from-primary/10 to-indigo-500/5 p-8 rounded-[2rem] border-none shadow-sm mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 text-primary">
                    <User className="h-10 w-10" />
                    Your Profile
                </h1>
                <p className="text-muted-foreground text-lg ml-1">
                    Manage your personal information and display picture.
                </p>
            </div>

            <Card className="rounded-[2rem] border-none shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                    <CardTitle className="text-xl">Profile Details</CardTitle>
                    <CardDescription className="text-base">
                        Update your public facing information here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-8">

                        <div className="flex flex-col sm:flex-row gap-8 items-start">
                            {/* Avatar Section */}
                            <div className="shrink-0 flex flex-col gap-2 items-center">
                                <Label className="text-muted-foreground uppercase text-xs tracking-wider font-semibold">
                                    Display Picture
                                </Label>
                                <AvatarUpload
                                    currentUrl={avatarUrl}
                                    onUploadSuccess={handleAvatarUpload}
                                    fallbackText={displayName ? displayName.charAt(0).toUpperCase() : "U"}
                                />
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 space-y-4 w-full">
                                <div className="space-y-2">
                                    <Label htmlFor="display_name" className="text-muted-foreground uppercase text-xs tracking-wider font-semibold">
                                        Display Name
                                    </Label>
                                    <Input
                                        id="display_name"
                                        placeholder="Awesome Driver"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="max-w-md h-12 rounded-xl"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        This is the name that will be displayed in the application sidebar.
                                    </p>
                                </div>
                                <div className="space-y-2 pt-4">
                                    <Label htmlFor="currency" className="text-muted-foreground uppercase text-xs tracking-wider font-semibold">
                                        Preferred Currency
                                    </Label>
                                    <Select value={currency} onValueChange={setCurrency}>
                                        <SelectTrigger id="currency" className="max-w-md h-12 rounded-xl">
                                            <SelectValue placeholder="Select a currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map((curr) => (
                                                <SelectItem key={curr.value} value={curr.value} className="cursor-pointer">
                                                    {curr.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        This currency symbol will be used across all your tracking and insights.
                                    </p>
                                </div>
                                <div className="space-y-2 pt-4">
                                    <Label htmlFor="distance_unit" className="text-muted-foreground uppercase text-xs tracking-wider font-semibold">
                                        Distance Unit
                                    </Label>
                                    <Select value={distanceUnit} onValueChange={(val) => setDistanceUnit(val as "km" | "miles")}>
                                        <SelectTrigger id="distance_unit" className="max-w-md h-12 rounded-xl">
                                            <SelectValue placeholder="Select distance unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="km" className="cursor-pointer">Kilometers (km)</SelectItem>
                                            <SelectItem value="miles" className="cursor-pointer">Miles</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        Will affect speed, volumes (Liters vs Gallons) and economy rates.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100/50 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="pt-4 border-t border-border/50">
                            <Button type="submit" disabled={isSaving} size="lg" className="rounded-xl w-full sm:w-auto mt-2 gap-2">
                                <Save className="h-4 w-4" />
                                {isSaving ? "Saving..." : "Save Profile"}
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-none shadow-sm bg-card/50 backdrop-blur-sm mt-8">
                <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Your Garage</CardTitle>
                            <CardDescription className="text-base">
                                Manage the vehicles you want to track.
                            </CardDescription>
                        </div>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-2 rounded-xl">
                                    <PlusCircle className="h-4 w-4" />
                                    Add Vehicle
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                                <DialogHeader>
                                    <DialogTitle>Add New Vehicle</DialogTitle>
                                    <DialogDescription>
                                        Enter the details of your vehicle to start tracking it.
                                    </DialogDescription>
                                </DialogHeader>
                                <form ref={addFormRef} onSubmit={handleAddVehicle} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="make">Make</Label>
                                        <Input id="make" name="make" placeholder="e.g. Toyota" required className="rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Input id="model" name="model" placeholder="e.g. Camry" required className="rounded-xl" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Year</Label>
                                            <Input id="year" name="year" type="number" min="1900" max={new Date().getFullYear() + 1} placeholder="2020" required className="rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="baseline_odometer">Initial Distance ({distanceUnit})</Label>
                                            <Input id="baseline_odometer" name="baseline_odometer" type="number" min="0" step="any" placeholder="0" required className="rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <Button type="submit" disabled={isAddingVehicle} className="rounded-xl">
                                            {isAddingVehicle ? "Adding..." : "Add Vehicle"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {vehicleMessage && (
                        <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${vehicleMessage.type === 'success' ? 'bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100/50 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {vehicleMessage.text}
                        </div>
                    )}

                    {isVehiclesLoading ? (
                        <div className="flex justify-center p-8">
                            <p className="text-muted-foreground animate-pulse">Loading garage...</p>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center p-8 border border-dashed rounded-[2rem] bg-muted/20">
                            <Car className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium">Your garage is empty</h3>
                            <p className="text-muted-foreground mt-1">Add a vehicle to start tracking your fuel and maintenance.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {vehicles.map((vehicle) => (
                                <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-[1.5rem] bg-background shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                                            <Car className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                                            <p className="text-sm text-muted-foreground">OD: {vehicle.baseline_odometer.toLocaleString()} {distanceUnit}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                        onClick={() => handleDeleteVehicle(vehicle.id)}
                                        disabled={isDeletingId === vehicle.id}
                                    >
                                        {isDeletingId === vehicle.id ? (
                                            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </MotionWrapper>
    );
}
