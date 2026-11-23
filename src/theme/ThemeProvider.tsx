import React, {useCallback, useEffect, useMemo, useState} from "react";
import {STORAGE_KEYS} from "@/constants/storage";
import { Theme, ThemeContext } from "./ThemeContext";

function applyThemeClass(theme: Theme) {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
}

function detectInitialTheme(): Theme {
    const persisted = (localStorage.getItem(STORAGE_KEYS.theme) as Theme | null);
    if (persisted === "light" || persisted === "dark") return persisted;

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === "undefined") return "light";
        try {
            return detectInitialTheme();
        } catch {
            return "light";
        }
    });

    const setTheme = useCallback((t: Theme) => {
        setThemeState(t);

        try {
            localStorage.setItem(STORAGE_KEYS.theme, t);
        } catch {
            console.log("Failed to set theme in localStorage");
        }

        applyThemeClass(t);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setTheme]);

    useEffect(() => {
        applyThemeClass(theme);
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
