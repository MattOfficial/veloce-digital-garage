"use client";

import { useEffect, useState } from "react";
import { User, Save } from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/avatar-upload";
import { updateProfile } from "./actions";
import { useUserStore } from "@/store/user-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        </MotionWrapper>
    );
}
