"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { User, Save, Car, Trash2, PlusCircle, Zap, Leaf, Truck, Lock, CheckCircle2 } from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/avatar-upload";
import { ImageUploadOrLink } from "@/components/image-upload-or-link";
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
    const { profile, fetchProfile } = useUserStore();

    // We keep local state for formatting edits before save, initialized from the store
    const [displayName, setDisplayName] = useState(profile.displayName || "");
    const [currency, setCurrency] = useState(profile.currency || "₹");
    const [distanceUnit, setDistanceUnit] = useState<"km" | "miles">(profile.distanceUnit || "km");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatarUrl);
    const [llmKey, setLlmKey] = useState<string>("");

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Vehicle state
    const { vehicles, fetchVehicles, isLoading: isVehiclesLoading } = useVehicleStore();
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const [vehicleMessage, setVehicleMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newVehicleImageUrl, setNewVehicleImageUrl] = useState<string>("");
    const [selectedPowertrain, setSelectedPowertrain] = useState<string>("ice");
    const addFormRef = useRef<HTMLFormElement>(null);

    // Initial fetch to sync store if not already loaded, and set local state
    useEffect(() => {
        const initialize = async () => {
            await fetchProfile();
        };
        initialize();
    }, [fetchProfile]);




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
        if (llmKey) {
            formData.append("llm_key", llmKey);
        }

        const result = await updateProfile(formData);

        if (result?.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: "Profile updated successfully!" });
            setLlmKey(""); // Clear it from local state after saving for security
            fetchProfile(); // Re-fetch to update hasLlmKey status
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
            setNewVehicleImageUrl(""); // Reset local image state
            setSelectedPowertrain("ice");
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

                        <div className="pt-6 mt-6 border-t border-border/50">
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <Lock className="h-5 w-5 text-primary" />
                                Veloce Copilot Settings
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2 max-w-md">
                                    <Label htmlFor="llm_key" className="text-muted-foreground uppercase text-xs tracking-wider font-semibold">
                                        Google Gemini API Key
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="llm_key"
                                            type="password"
                                            placeholder={profile.hasLlmKey ? "••••••••••••••••••••••••••••" : "AIzaSy..."}
                                            value={llmKey}
                                            onChange={(e) => setLlmKey(e.target.value)}
                                            className="h-12 rounded-xl pr-10"
                                        />
                                        {profile.hasLlmKey && !llmKey && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" title="Key is stored securely">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {profile.hasLlmKey
                                            ? "Your key is currently encrypted and securely stored in our database. Enter a new key to overwrite it."
                                            : "Bring your own key to enable AI features. It will be encrypted with AES-256 before storage."}
                                    </p>
                                </div>
                            </div>
                        </div>

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
                            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-border/50 shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle>Add New Vehicle</DialogTitle>
                                    <DialogDescription>
                                        Enter the details of your vehicle to start tracking it.
                                    </DialogDescription>
                                </DialogHeader>
                                <form ref={addFormRef} onSubmit={handleAddVehicle} className="space-y-4 pt-4">
                                    <input type="hidden" name="image_url" value={newVehicleImageUrl} />

                                    <div className="space-y-2">
                                        <Label>Vehicle Image</Label>
                                        <ImageUploadOrLink
                                            onImageSelected={setNewVehicleImageUrl}
                                            currentUrl={newVehicleImageUrl}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="make">Make</Label>
                                        <Input id="make" name="make" placeholder="e.g. Toyota" required className="h-11 rounded-xl bg-muted/50 border-white/10 focus:border-primary/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Input id="model" name="model" placeholder="e.g. Camry" required className="h-11 rounded-xl bg-muted/50 border-white/10 focus:border-primary/50" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="vehicle_type">Type</Label>
                                            <Select name="vehicle_type" defaultValue="car">
                                                <SelectTrigger className="h-11 w-full rounded-xl bg-muted/50 border-white/10 focus:border-primary/50">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="car">Car</SelectItem>
                                                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                                                    <SelectItem value="truck">Truck</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="powertrain">Powertrain</Label>
                                            <Select name="powertrain" value={selectedPowertrain} onValueChange={setSelectedPowertrain}>
                                                <SelectTrigger className="h-11 w-full rounded-xl bg-muted/50 border-white/10 focus:border-primary/50">
                                                    <SelectValue placeholder="Select powertrain" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="ice">Combustion (ICE)</SelectItem>
                                                    <SelectItem value="ev">Electric (EV)</SelectItem>
                                                    <SelectItem value="phev">Plug-in Hybrid (PHEV)</SelectItem>
                                                    <SelectItem value="hev">Hybrid (HEV)</SelectItem>
                                                    <SelectItem value="rex">Range Extender (REX)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Year</Label>
                                            <Input id="year" name="year" type="number" min="1900" max={new Date().getFullYear() + 1} placeholder="2020" required className="h-11 rounded-xl bg-muted/50 border-white/10 focus:border-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="baseline_odometer">Initial Distance ({distanceUnit})</Label>
                                            <Input id="baseline_odometer" name="baseline_odometer" type="number" min="0" step="any" placeholder="0" required className="h-11 rounded-xl bg-muted/50 border-white/10 focus:border-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        </div>
                                    </div>
                                    {(selectedPowertrain === 'ev' || selectedPowertrain === 'phev' || selectedPowertrain === 'rex') && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Label htmlFor="battery_capacity_kwh">Battery Capacity (kWh) <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
                                            <Input id="battery_capacity_kwh" name="battery_capacity_kwh" type="number" min="0" step="any" placeholder="e.g. 75" className="h-11 rounded-xl bg-muted/50 border-white/10 focus:border-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        </div>
                                    )}
                                    <div className="pt-4 flex justify-end">
                                        <Button type="submit" disabled={isAddingVehicle} className="rounded-xl h-11 w-full font-semibold shadow-md active:scale-[0.98] transition-all">
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
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {vehicles.map((vehicle) => (
                                <Link
                                    href={`/vehicles/${vehicle.id}`}
                                    key={vehicle.id}
                                    className="relative flex flex-col rounded-[2rem] bg-gradient-to-b from-border/50 to-background border shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                                >
                                    {/* Delete Button (Absolute Top Right) */}
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent navigating to the vehicle link when clicking delete
                                            handleDeleteVehicle(vehicle.id);
                                        }}
                                        disabled={isDeletingId === vehicle.id}
                                    >
                                        {isDeletingId === vehicle.id ? (
                                            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Delete</span>
                                    </Button>

                                    {/* Image Section (Top half of the card) */}
                                    <div className="w-full h-48 bg-muted relative overflow-hidden border-b">
                                        {vehicle.image_url ? (
                                            <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={vehicle.image_url}
                                                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20 group-hover:scale-105 transition-transform duration-500">
                                                {vehicle.vehicle_type === 'truck' ? <Truck className="h-20 w-20" /> : <Car className="h-20 w-20" />}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                        <div className="absolute bottom-3 left-4 flex gap-2">
                                            <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-primary/20 backdrop-blur-md">
                                                {vehicle.year}
                                            </div>
                                            {vehicle.powertrain === 'ev' && (
                                                <div className="bg-blue-500/80 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-blue-400/30 backdrop-blur-md flex items-center gap-1">
                                                    <Zap className="h-3 w-3" /> EV {vehicle.battery_capacity_kwh ? `| ${vehicle.battery_capacity_kwh}kWh` : ''}
                                                </div>
                                            )}
                                            {(vehicle.powertrain === 'phev' || vehicle.powertrain === 'hev' || vehicle.powertrain === 'rex') && (
                                                <div className="bg-emerald-500/80 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-emerald-400/30 backdrop-blur-md flex items-center gap-1">
                                                    <Leaf className="h-3 w-3" /> {vehicle.powertrain.toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Details Section (Bottom half of the card) */}
                                    <div className="p-5 flex flex-col gap-1 bg-card/40 backdrop-blur-xl relative z-0">
                                        <h4 className="font-bold text-xl leading-tight text-foreground truncate">
                                            {vehicle.make} {vehicle.model}
                                        </h4>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 font-medium">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            Active
                                            <span className="mx-1 opacity-50">•</span>
                                            {vehicle.baseline_odometer.toLocaleString()} {distanceUnit}
                                        </div>
                                    </div>

                                    {/* Glassmorphic/Holographic inner border reflection */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </MotionWrapper>
    );
}
