import {ThemeProvider} from "@/theme/ThemeProvider";
import React from "react";

export function ThemeAppProvider({ children }: { children: React.ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
}