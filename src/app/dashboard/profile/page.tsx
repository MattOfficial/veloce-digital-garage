"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  User,
  Save,
  Car,
  Trash2,
  PlusCircle,
  Zap,
  Leaf,
  Truck,
  Lock,
  CheckCircle2,
  Flag,
  Droplet,
  Wrench,
  Fuel,
  Timer,
  ShieldCheck,
  Bot,
  Trophy,
  Route,
} from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { getUserBadges } from "@/app/actions/badges";
import { BADGE_REGISTRY } from "@/lib/badges";
import type { BadgeDefinition } from "@/lib/badges";
import { AvatarUpload } from "@/components/avatar-upload";
import { ImageUploadOrLink } from "@/components/image-upload-or-link";
import { updateProfile, deleteLlmKey } from "./actions";
import { addVehicle, deleteVehicle } from "@/app/actions/vehicles";
import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import { toast } from "sonner";
import { isProviderPreference, type ProviderPreference } from "@/types/ai";
import {
  createTrailingDayRange,
  createTrailingMonthRange,
  getGarageDistanceSummary,
  getGarageLifetimeDistanceSummary,
} from "@/utils/distance-analytics";
import { ui } from "@/content/en/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/veloce-ui";

type ProfileDraft = {
  displayName: string;
  currency: string;
  distanceUnit: "km" | "miles";
  avatarUrl: string | null;
  preferredProvider: ProviderPreference;
};

function createProfileDraft(
  profile: ReturnType<typeof useUserStore.getState>["profile"],
): ProfileDraft {
  return {
    displayName: profile.displayName || "",
    currency: profile.currency || "₹",
    distanceUnit: profile.distanceUnit || "km",
    avatarUrl: profile.avatarUrl || null,
    preferredProvider: profile.preferredProvider || "gemini",
  };
}

export default function ProfilePage() {
  const { profile, fetchProfile } = useUserStore();

  // We keep local state for formatting edits before save, initialized from the store
  const [profileDraft, setProfileDraft] = useState<ProfileDraft | null>(null);
  const [llmKey, setLlmKey] = useState<string>("");
  const [openAiKey, setOpenAiKey] = useState<string>("");
  const [deepseekKey, setDeepseekKey] = useState<string>("");

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Vehicle state
  const {
    vehicles,
    fetchVehicles,
    isLoading: isVehiclesLoading,
  } = useVehicleStore();
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [vehicleMessage, setVehicleMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newVehicleImageUrl, setNewVehicleImageUrl] = useState<string>("");
  const [selectedPowertrain, setSelectedPowertrain] = useState<string>("ice");
  const addFormRef = useRef<HTMLFormElement>(null);

  // Badges State
  const [earnedBadges, setEarnedBadges] = useState<
    { badge_id: string; earned_at: string }[]
  >([]);

  // Initial fetch to sync store if not already loaded, and set local state
  useEffect(() => {
    const initialize = async () => {
      await Promise.all([fetchProfile(), fetchVehicles()]);
      const badges = await getUserBadges();
      setEarnedBadges(badges);
    };
    initialize();
  }, [fetchProfile, fetchVehicles]);

  const resolvedProfile = profileDraft ?? createProfileDraft(profile);
  const formatDistance = (value: number) =>
    new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0,
    }).format(value);
  const garageDistanceMetrics = useMemo(
    () => ({
      last30Days: getGarageDistanceSummary(
        vehicles,
        createTrailingDayRange(30),
      ),
      last12Months: getGarageDistanceSummary(
        vehicles,
        createTrailingMonthRange(12),
      ),
      lifetime: getGarageLifetimeDistanceSummary(vehicles),
    }),
    [vehicles],
  );

  const updateProfileDraft = <K extends keyof ProfileDraft>(
    field: K,
    value: ProfileDraft[K],
  ) => {
    setProfileDraft((currentDraft) => ({
      ...(currentDraft ?? createProfileDraft(profile)),
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("display_name", resolvedProfile.displayName);
    formData.append("currency", resolvedProfile.currency);
    formData.append("distance_unit", resolvedProfile.distanceUnit);
    if (resolvedProfile.avatarUrl) {
      formData.append("avatar_url", resolvedProfile.avatarUrl);
    }
    if (llmKey) {
      formData.append("llm_key", llmKey);
    }
    if (openAiKey) {
      formData.append("openai_key", openAiKey);
    }
    if (deepseekKey) {
      formData.append("deepseek_key", deepseekKey);
    }
    formData.append("preferred_provider", resolvedProfile.preferredProvider);

    const result = await updateProfile(formData);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: ui.profile.saveSuccess });
      setProfileDraft(null);
      setLlmKey("");
      setOpenAiKey("");
      setDeepseekKey("");
      await fetchProfile();
    }
    setIsSaving(false);
  };

  const handleAvatarUpload = (url: string) => {
    updateProfileDraft("avatarUrl", url);
    // We don't auto-save here, user must click Save Profile
    setMessage({ type: "success", text: ui.profile.avatarUploaded });
  };

  const handleClearStorage = () => {
    if (!confirm(ui.profile.clearStorageConfirm)) return;
    localStorage.clear();
    sessionStorage.clear();
    toast.success(ui.profile.clearStorageSuccess);
  };

  const handleDeleteKey = async (
    provider: "gemini" | "openai" | "deepseek",
  ) => {
    const providerLabel =
      provider === "gemini"
        ? ui.profile.providerOptions.gemini
        : provider === "openai"
          ? ui.profile.providerOptions.openai
          : ui.profile.providerOptions.deepseek;
    if (!confirm(ui.profile.deleteKeyConfirm(providerLabel))) return;

    setIsSaving(true);
    const result = await deleteLlmKey(provider);
    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: ui.profile.keyDeleteSuccess });
      if (provider === "gemini") setLlmKey("");
      if (provider === "openai") setOpenAiKey("");
      if (provider === "deepseek") setDeepseekKey("");
      await fetchProfile();
    }
    setIsSaving(false);
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormRef.current) return;

    setIsAddingVehicle(true);
    setVehicleMessage(null);

    const formData = new FormData(addFormRef.current);
    const result = await addVehicle(formData);

    if (result?.error) {
      setVehicleMessage({ type: "error", text: result.error });
    } else {
      setVehicleMessage({ type: "success", text: ui.profile.vehicleAdded });
      if (result.newBadges?.length) {
        result.newBadges.forEach((badge: BadgeDefinition) =>
          setTimeout(
            () =>
              toast.success(`🏆 Unlocked: ${badge.name}!`, {
                description: badge.description,
              }),
            500,
          ),
        );
      }
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
      setVehicleMessage({ type: "error", text: result.error });
    } else {
      setVehicleMessage({ type: "success", text: ui.profile.vehicleDeleted });
      fetchVehicles(); // Refresh
    }
    setIsDeletingId(null);
  };

  const handlePreferredProviderChange = (value: string) => {
    if (isProviderPreference(value)) {
      updateProfileDraft("preferredProvider", value);
    }
  };

  const handleDistanceUnitChange = (value: string) => {
    if (value === "km" || value === "miles") {
      updateProfileDraft("distanceUnit", value);
    }
  };

  return (
    <MotionWrapper className="max-w-3xl mx-auto space-y-8 pb-10 px-4">
      <div className="flex flex-col gap-2 bg-gradient-to-br from-primary/10 to-indigo-500/5 p-8 rounded-[2rem] border-none shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 text-primary relative z-10">
          <User className="h-10 w-10" />
          {ui.profile.headerTitle}
        </h1>
        <p className="text-muted-foreground text-lg ml-1 relative z-10">
          {ui.profile.rewardsDescription}
        </p>
      </div>

      {/* Trophy Cabinet */}
      <Card className="rounded-[2rem] border-none shadow-sm bg-card/50 backdrop-blur-sm mb-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl flex items-center gap-2 text-amber-500">
            <Trophy className="h-6 w-6" />
            {ui.profile.achievementsTitle}
          </CardTitle>
          <CardDescription className="text-base">
            {ui.profile.achievementsDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.values(BADGE_REGISTRY).map((badge) => {
              const earned = earnedBadges.find((b) => b.badge_id === badge.id);
              const isEarned = !!earned;

              // Map string icon to lucide component dynamically
              const renderIcon = () => {
                const props = { className: "h-8 w-8 mb-2" };
                switch (badge.icon) {
                  case "Flag":
                    return <Flag {...props} />;
                  case "Droplet":
                    return <Droplet {...props} />;
                  case "Wrench":
                    return <Wrench {...props} />;
                  case "Fuel":
                    return <Fuel {...props} />;
                  case "Timer":
                    return <Timer {...props} />;
                  case "ShieldCheck":
                    return <ShieldCheck {...props} />;
                  case "Car":
                    return <Car {...props} />;
                  case "Bot":
                    return <Bot {...props} />;
                  default:
                    return <Trophy {...props} />;
                }
              };

              const getTierStyles = () => {
                if (!isEarned)
                  return "opacity-50 grayscale border-white/5 bg-white/5";
                switch (badge.tier) {
                  case "bronze":
                    return "border-[#cd7f32]/50 bg-gradient-to-br from-[#cd7f32]/20 to-transparent text-[#cd7f32] shadow-[0_0_15px_-3px_rgba(205,127,50,0.3)]";
                  case "silver":
                    return "border-slate-300/50 bg-gradient-to-br from-slate-300/20 to-transparent text-slate-300 shadow-[0_0_15px_-3px_rgba(203,213,225,0.3)]";
                  case "gold":
                    return "border-yellow-400/50 bg-gradient-to-br from-yellow-400/20 to-transparent text-yellow-400 shadow-[0_0_15px_-3px_rgba(250,204,21,0.4)]";
                  case "platinum":
                    return "border-cyan-300/50 bg-gradient-to-br from-cyan-300/20 to-transparent text-cyan-300 shadow-[0_0_15px_-3px_rgba(103,232,249,0.5)]";
                  default:
                    return "border-primary/50 bg-primary/10 text-primary";
                }
              };

              return (
                <div
                  key={badge.id}
                  title={badge.description}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 ${getTierStyles()}`}
                >
                  {!isEarned && (
                    <div className="absolute top-2 right-2 opacity-50">
                      <Lock className="h-3 w-3" />
                    </div>
                  )}
                  {renderIcon()}
                  <span className="text-xs font-bold text-center leading-tight">
                    {badge.name}
                  </span>
                  {isEarned && earned?.earned_at && (
                    <span className="text-[10px] opacity-70 mt-1">
                      {new Date(earned.earned_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Route className="h-6 w-6 text-cyan-400" />
            {ui.profile.distanceAnalyticsTitle}
          </CardTitle>
          <CardDescription className="text-base">
            {ui.profile.distanceAnalyticsDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { key: "last30Days", label: ui.profile.distanceLastThirtyDays },
              {
                key: "last12Months",
                label: ui.profile.distanceLastTwelveMonths,
              },
              { key: "lifetime", label: ui.profile.lifetimeDistance },
            ].map(({ key, label }) => {
              const summary =
                garageDistanceMetrics[
                  key as keyof typeof garageDistanceMetrics
                ];
              const helperText = summary.hasSufficientData
                ? summary.coverage === "partial"
                  ? ui.profile.distancePartialCoverage(
                      summary.contributingVehicles,
                      summary.totalVehicles,
                    )
                  : ui.profile.distanceFullCoverageDescription
                : ui.profile.distanceUnavailableDescription;

              return (
                <div
                  key={key}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <p className="text-sm font-medium text-muted-foreground">
                    {label}
                  </p>
                  <div className="mt-3 text-3xl font-black">
                    {isVehiclesLoading && vehicles.length === 0
                      ? ui.common.emptyValue
                      : summary.hasSufficientData && summary.value != null
                        ? `${formatDistance(summary.value)} ${resolvedProfile.distanceUnit}`
                        : ui.profile.distanceUnavailable}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {isVehiclesLoading && vehicles.length === 0
                      ? ui.dashboard.loading
                      : helperText}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl">{ui.profile.detailsTitle}</CardTitle>
          <CardDescription className="text-base">
            {ui.profile.detailsDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Avatar Section */}
              <div className="shrink-0 flex flex-col gap-2 items-center">
                <Label className="text-muted-foreground uppercase text-xs tracking-wider font-semibold">
                  {ui.profile.avatarLabel}
                </Label>
                <AvatarUpload
                  currentUrl={resolvedProfile.avatarUrl}
                  onUploadSuccess={handleAvatarUpload}
                  fallbackText={
                    resolvedProfile.displayName
                      ? resolvedProfile.displayName.charAt(0).toUpperCase()
                      : "U"
                  }
                />
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <Label
                    htmlFor="display_name"
                    className="text-muted-foreground uppercase text-xs tracking-wider font-semibold"
                  >
                    {ui.profile.displayName}
                  </Label>
                  <Input
                    id="display_name"
                    placeholder={ui.profile.displayNamePlaceholder}
                    value={resolvedProfile.displayName}
                    onChange={(e) =>
                      updateProfileDraft("displayName", e.target.value)
                    }
                    className="max-w-md h-12 rounded-xl"
                  />
                  <p className="text-sm text-muted-foreground">
                    {ui.profile.displayNameDescription}
                  </p>
                </div>
                <div className="space-y-2 pt-4">
                  <Label
                    htmlFor="currency"
                    className="text-muted-foreground uppercase text-xs tracking-wider font-semibold"
                  >
                    {ui.profile.preferredCurrency}
                  </Label>
                  <Select
                    value={resolvedProfile.currency}
                    onValueChange={(value) =>
                      updateProfileDraft("currency", value)
                    }
                  >
                    <SelectTrigger
                      id="currency"
                      className="max-w-md h-12 rounded-xl"
                    >
                      <SelectValue
                        placeholder={ui.profile.currencyPlaceholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {ui.profile.currencies.map((curr) => (
                        <SelectItem
                          key={curr.value}
                          value={curr.value}
                          className="cursor-pointer"
                        >
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {ui.profile.currencyDescription}
                  </p>
                </div>
                <div className="space-y-2 pt-4">
                  <Label
                    htmlFor="distance_unit"
                    className="text-muted-foreground uppercase text-xs tracking-wider font-semibold"
                  >
                    {ui.profile.distanceUnit}
                  </Label>
                  <Select
                    value={resolvedProfile.distanceUnit}
                    onValueChange={handleDistanceUnitChange}
                  >
                    <SelectTrigger
                      id="distance_unit"
                      className="max-w-md h-12 rounded-xl"
                    >
                      <SelectValue
                        placeholder={ui.profile.distanceUnitPlaceholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km" className="cursor-pointer">
                        {ui.profile.distanceOptions.kilometers}
                      </SelectItem>
                      <SelectItem value="miles" className="cursor-pointer">
                        {ui.profile.distanceOptions.miles}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {ui.profile.distanceUnitDescription}
                  </p>
                </div>
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100/50 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
              >
                {message.text}
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-border/50">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-primary" />
                {ui.profile.copilotSettings}
              </h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label
                    htmlFor="preferred_provider"
                    className="text-muted-foreground uppercase text-xs tracking-wider font-semibold"
                  >
                    {ui.profile.preferredProvider}
                  </Label>
                  <Select
                    value={resolvedProfile.preferredProvider}
                    onValueChange={handlePreferredProviderChange}
                  >
                    <SelectTrigger
                      id="preferred_provider"
                      className="h-12 rounded-xl"
                    >
                      <SelectValue
                        placeholder={ui.profile.providerPlaceholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">
                        {ui.profile.providerOptions.gemini}
                      </SelectItem>
                      <SelectItem value="openai">
                        {ui.profile.providerOptions.openai}
                      </SelectItem>
                      <SelectItem value="deepseek">
                        {ui.profile.providerOptions.deepseek}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gemini Key */}
                <div className="space-y-2">
                  <Label
                    htmlFor="llm_key"
                    className="text-muted-foreground uppercase text-xs tracking-wider font-semibold"
                  >
                    {ui.profile.geminiKey}
                  </Label>
                  <div className="relative">
                    <Input
                      id="llm_key"
                      type="password"
                      placeholder={
                        profile.hasLlmKey
                          ? ui.profile.maskedKey
                          : ui.profile.geminiKeyPlaceholder
                      }
                      value={llmKey}
                      onChange={(e) => setLlmKey(e.target.value)}
                      className="h-12 rounded-xl pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {profile.hasLlmKey && !llmKey && (
                        <>
                          <div
                            className="text-emerald-500"
                            title={ui.profile.secureKeyStored}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            onClick={() => handleDeleteKey("gemini")}
                            title={ui.profile.deleteKey}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* OpenAI Key */}
                <div className="space-y-2">
                  <Label
                    htmlFor="openai_key"
                    className="text-muted-foreground uppercase text-xs tracking-wider font-semibold"
                  >
                    {ui.profile.openaiKey}
                  </Label>
                  <div className="relative">
                    <Input
                      id="openai_key"
                      type="password"
                      placeholder={
                        profile.hasOpenAiKey
                          ? ui.profile.maskedKey
                          : ui.profile.openaiLikeKeyPlaceholder
                      }
                      value={openAiKey}
                      onChange={(e) => setOpenAiKey(e.target.value)}
                      className="h-12 rounded-xl pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {profile.hasOpenAiKey && !openAiKey && (
                        <>
                          <div
                            className="text-emerald-500"
                            title={ui.profile.secureKeyStored}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            onClick={() => handleDeleteKey("openai")}
                            title={ui.profile.deleteKey}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Deepseek Key */}
                <div className="space-y-2">
                  <Label
                    htmlFor="deepseek_key"
                    className="text-muted-foreground uppercase text-xs tracking-wider font-semibold"
                  >
                    {ui.profile.deepseekKey}
                  </Label>
                  <div className="relative">
                    <Input
                      id="deepseek_key"
                      type="password"
                      placeholder={
                        profile.hasDeepseekKey
                          ? ui.profile.maskedKey
                          : ui.profile.openaiLikeKeyPlaceholder
                      }
                      value={deepseekKey}
                      onChange={(e) => setDeepseekKey(e.target.value)}
                      className="h-12 rounded-xl pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {profile.hasDeepseekKey && !deepseekKey && (
                        <>
                          <div
                            className="text-emerald-500"
                            title={ui.profile.secureKeyStored}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            onClick={() => handleDeleteKey("deepseek")}
                            title={ui.profile.deleteKey}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground pt-2">
                  {ui.profile.bringYourOwnKeys}{" "}
                  {ui.profile.copilotProviderDescription}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex flex-wrap gap-4">
              <Button
                type="submit"
                disabled={isSaving}
                size="lg"
                className="rounded-xl w-full sm:w-auto mt-2 gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? ui.common.actions.saving : ui.profile.saveProfile}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="rounded-xl w-full sm:w-auto mt-2 gap-2 border-destructive/20 text-destructive hover:bg-destructive/10"
                onClick={handleClearStorage}
              >
                <Trash2 className="h-4 w-4" />
                {ui.profile.clearBrowserStorage}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="rounded-[2rem] border-none shadow-sm bg-card/50 backdrop-blur-sm mt-8">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {ui.profile.garageTitle}
              </CardTitle>
              <CardDescription className="text-base">
                {ui.profile.garageDescription}
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 rounded-xl">
                  <PlusCircle className="h-4 w-4" />
                  {ui.profile.addVehicle}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-border/50 shadow-2xl">
                <DialogHeader>
                  <DialogTitle>{ui.profile.addVehicleTitle}</DialogTitle>
                  <DialogDescription>
                    {ui.profile.addVehicleDescription}
                  </DialogDescription>
                </DialogHeader>
                <form
                  ref={addFormRef}
                  onSubmit={handleAddVehicle}
                  className="space-y-4 pt-4"
                >
                  <input
                    type="hidden"
                    name="image_url"
                    value={newVehicleImageUrl}
                  />

                  <div className="space-y-2">
                    <Label>{ui.profile.vehicleImage}</Label>
                    <ImageUploadOrLink
                      onImageSelected={setNewVehicleImageUrl}
                      currentUrl={newVehicleImageUrl}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="make">{ui.profile.make}</Label>
                    <Input
                      id="make"
                      name="make"
                      placeholder={ui.profile.makePlaceholder}
                      required
                      className="h-11 rounded-xl bg-muted/50 border-white/10 focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">{ui.profile.model}</Label>
                    <Input
                      id="model"
                      name="model"
                      placeholder={ui.profile.modelPlaceholder}
                      required
                      className="h-11 rounded-xl bg-muted/50 border-white/10 focus:border-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle_type">
                        {ui.profile.vehicleType}
                      </Label>
                      <Select name="vehicle_type" defaultValue="car">
                        <SelectTrigger className="h-11 w-full rounded-xl bg-muted/50 border-white/10 focus:border-primary/50">
                          <SelectValue
                            placeholder={ui.profile.vehicleTypePlaceholder}
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="car">
                            {ui.profile.vehicleTypeOptions.car}
                          </SelectItem>
                          <SelectItem value="motorcycle">
                            {ui.profile.vehicleTypeOptions.motorcycle}
                          </SelectItem>
                          <SelectItem value="truck">
                            {ui.profile.vehicleTypeOptions.truck}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="powertrain">
                        {ui.profile.powertrain}
                      </Label>
                      <Select
                        name="powertrain"
                        value={selectedPowertrain}
                        onValueChange={setSelectedPowertrain}
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl bg-muted/50 border-white/10 focus:border-primary/50">
                          <SelectValue
                            placeholder={ui.profile.powertrainPlaceholder}
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="ice">
                            {ui.profile.powertrainOptions.ice}
                          </SelectItem>
                          <SelectItem value="ev">
                            {ui.profile.powertrainOptions.ev}
                          </SelectItem>
                          <SelectItem value="phev">
                            {ui.profile.powertrainOptions.phev}
                          </SelectItem>
                          <SelectItem value="hev">
                            {ui.profile.powertrainOptions.hev}
                          </SelectItem>
                          <SelectItem value="rex">
                            {ui.profile.powertrainOptions.rex}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">{ui.profile.year}</Label>
                      <Input
                        id="year"
                        name="year"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        placeholder="2020"
                        required
                        className="h-11 rounded-xl bg-muted/50 border-white/10 focus:border-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="baseline_odometer">
                        {ui.profile.baselineDistance(
                          resolvedProfile.distanceUnit,
                        )}
                      </Label>
                      <Input
                        id="baseline_odometer"
                        name="baseline_odometer"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        required
                        className="h-11 rounded-xl bg-muted/50 border-white/10 focus:border-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                  {(selectedPowertrain === "ev" ||
                    selectedPowertrain === "phev" ||
                    selectedPowertrain === "rex") && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="battery_capacity_kwh">
                        {ui.profile.batteryCapacity}{" "}
                        <span className="text-muted-foreground text-xs font-normal">
                          {ui.profile.optional}
                        </span>
                      </Label>
                      <Input
                        id="battery_capacity_kwh"
                        name="battery_capacity_kwh"
                        type="number"
                        min="0"
                        step="any"
                        placeholder={ui.profile.batteryCapacityPlaceholder}
                        className="h-11 rounded-xl bg-muted/50 border-white/10 focus:border-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  )}
                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isAddingVehicle}
                      className="rounded-xl h-11 w-full font-semibold shadow-md active:scale-[0.98] transition-all"
                    >
                      {isAddingVehicle
                        ? ui.profile.addingVehicle
                        : ui.profile.addVehicle}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {vehicleMessage && (
            <div
              className={`p-4 mb-6 rounded-xl text-sm font-medium ${vehicleMessage.type === "success" ? "bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100/50 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
            >
              {vehicleMessage.text}
            </div>
          )}

          {isVehiclesLoading ? (
            <div className="flex justify-center p-8">
              <p className="text-muted-foreground animate-pulse">
                {ui.profile.loadingGarage}
              </p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-[2rem] bg-muted/20">
              <Car className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">
                {ui.profile.emptyGarageTitle}
              </h3>
              <p className="text-muted-foreground mt-1">
                {ui.profile.emptyGarageDescription}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <Link
                  href={`/dashboard/vehicles/${vehicle.id}`}
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
                    <span className="sr-only">{ui.profile.deleteVehicle}</span>
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
                        {vehicle.vehicle_type === "truck" ? (
                          <Truck className="h-20 w-20" />
                        ) : (
                          <Car className="h-20 w-20" />
                        )}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-4 flex gap-2">
                      <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-primary/20 backdrop-blur-md">
                        {vehicle.year}
                      </div>
                      {vehicle.powertrain === "ev" && (
                        <div className="bg-blue-500/80 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-blue-400/30 backdrop-blur-md flex items-center gap-1">
                          <Zap className="h-3 w-3" /> EV{" "}
                          {vehicle.battery_capacity_kwh
                            ? `| ${vehicle.battery_capacity_kwh}kWh`
                            : ""}
                        </div>
                      )}
                      {(vehicle.powertrain === "phev" ||
                        vehicle.powertrain === "hev" ||
                        vehicle.powertrain === "rex") && (
                        <div className="bg-emerald-500/80 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-emerald-400/30 backdrop-blur-md flex items-center gap-1">
                          <Leaf className="h-3 w-3" />{" "}
                          {vehicle.powertrain.toUpperCase()}
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
                      {ui.profile.active}
                      <span className="mx-1 opacity-50">•</span>
                      {vehicle.baseline_odometer.toLocaleString()}{" "}
                      {resolvedProfile.distanceUnit}
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
