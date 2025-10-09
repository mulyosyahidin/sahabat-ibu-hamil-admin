import { useTheme } from "@/theme/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle color mode"
                className="rounded-full border border-neutral-300 dark:border-neutral-700
                   bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-4 py-2
                   shadow hover:shadow-lg transition
                   text-sm font-medium flex items-center gap-2
                   text-neutral-700 dark:text-neutral-200
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
            >
                <span
                    className="inline-flex h-4 w-4 items-center justify-center"
                    aria-hidden>
                    {theme === "dark" ? (
                        <Moon className="h-4 w-4 transition-transform duration-300" />
                    ) : (
                        <Sun className="h-4 w-4 transition-transform duration-300" />
                    )}
                </span>
                <span className="hidden sm:inline select-none">
                    {theme === "dark" ? "Dark" : "Light"}
                </span>
            </button>
        </div>
    );
}
