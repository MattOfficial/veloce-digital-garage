"use client";

import { useEffect } from "react";
import { useThemeStore, type Theme } from "@/store/theme-store";

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = "dark" }: ThemeProviderProps) {
    const { theme } = useThemeStore();

    useEffect(() => {
        // Apply theme class to document
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        const currentTheme = theme || defaultTheme;
        root.classList.add(currentTheme);
    }, [theme, defaultTheme]);

    return <>{children}</>;
}
