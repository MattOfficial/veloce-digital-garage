"use client";

import { useVibeEngine } from "vibe-particles/react";
import { SwarmPhysics, DotRenderer, NoInteraction } from "vibe-particles";
import { useSyncExternalStore } from "react";
import { useThemeStore } from "@/store/theme-store";

function VibeParticles({ rgb }: { rgb: [number, number, number] }) {
    const { canvasRef } = useVibeEngine({
        physics: SwarmPhysics,
        renderer: DotRenderer,
        interaction: NoInteraction,
        spacing: 28,
        baseRadius: 1,
        rgb,
    });

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
        />
    );
}

// Subscribe to DOM theme changes via MutationObserver
function subscribeToTheme(callback: () => void) {
    if (typeof document === "undefined") return () => {};
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });
    return () => observer.disconnect();
}

// Get current theme from DOM
function getThemeSnapshot(): "light" | "dark" {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.classList.contains("light") ? "light" : "dark";
}

// Server-side snapshot (always dark to avoid hydration mismatch)
function getServerSnapshot(): "light" | "dark" {
    return "dark";
}

function useDOMTheme() {
    return useSyncExternalStore(
        subscribeToTheme,
        getThemeSnapshot,
        getServerSnapshot
    );
}

export function InteractiveBackground() {
    const { theme: storeTheme } = useThemeStore();
    const domTheme = useDOMTheme();

    // Prefer store theme if hydrated, otherwise use DOM theme
    const activeTheme = storeTheme || domTheme;

    // Light mode needs dark particles to show on white background
    // Dark mode uses bright blue particles
    const rgb: [number, number, number] = activeTheme === "dark" ? [59, 130, 246] : [45, 45, 45];

    // Force remount when theme changes so particles reinitialize with correct color
    return <VibeParticles key={activeTheme} rgb={rgb} />;
}
