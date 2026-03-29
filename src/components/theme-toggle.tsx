"use client";

import { useThemeStore } from "@/store/theme-store";
import { Switch } from "@mattofficial/veloce-ui";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
    variant?: "default" | "compact";
}

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
    const { theme, toggleTheme } = useThemeStore();
    const isDark = theme === "dark";

    if (variant === "compact") {
        return (
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center h-9 w-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
            >
                {isDark ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                    <Moon className="h-4 w-4 text-slate-600" />
                )}
            </button>
        );
    }

    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                {isDark ? (
                    <Moon className="h-4 w-4 text-primary" />
                ) : (
                    <Sun className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-sm font-medium">
                    {isDark ? "Dark Mode" : "Light Mode"}
                </span>
            </div>
            <Switch
                checked={isDark}
                onCheckedChange={toggleTheme}
                aria-label="Toggle dark mode"
            />
        </div>
    );
}
