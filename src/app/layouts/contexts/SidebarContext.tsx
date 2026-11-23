import React, { createContext, useEffect, useMemo, useState, useCallback } from "react";

export type SidebarContextValue = {
    isExpanded: boolean;
    isMobileOpen: boolean;
    isHovered: boolean;
    activeItem: string | null;
    openSubmenu: string | null;

    toggleSidebar: () => void;
    toggleMobileSidebar: () => void;
    setIsHovered: (v: boolean) => void;
    setActiveItem: (item: string | null) => void;
    toggleSubmenu: (item: string) => void;
    setExpanded: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

const STORAGE_KEY = "ui.sidebar.expanded";
const MOBILE_QUERY = "(max-width: 767px)";

function useIsMobile() {
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
        return window.matchMedia(MOBILE_QUERY).matches;
    });

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
        const mql = window.matchMedia(MOBILE_QUERY);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

        setIsMobile(mql.matches);
        mql.addEventListener?.("change", handler);
        return () => mql.removeEventListener?.("change", handler);
    }, []);

    return isMobile;
}

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isMobile = useIsMobile();

    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
        if (typeof window === "undefined") return true;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved === null ? true : saved === "true";
        } catch {
            return true;
        }
    });

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            if (!isMobile) localStorage.setItem(STORAGE_KEY, String(isExpanded));
        } catch {
            setIsExpanded(true);
        }
    }, [isExpanded, isMobile]);

    useEffect(() => {
        if (!isMobile) setIsMobileOpen(false);
    }, [isMobile]);

    const toggleSidebar = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    const toggleMobileSidebar = useCallback(() => {
        setIsMobileOpen(prev => !prev);
    }, []);

    const toggleSubmenu = useCallback((item: string) => {
        setOpenSubmenu(prev => (prev === item ? null : item));
    }, []);

    const setExpanded = useCallback((v: boolean) => setIsExpanded(v), []);

    const value: SidebarContextValue = useMemo(
        () => ({
            isExpanded: isMobile ? false : isExpanded,
            isMobileOpen,
            isHovered,
            activeItem,
            openSubmenu,
            toggleSidebar,
            toggleMobileSidebar,
            setIsHovered,
            setActiveItem,
            toggleSubmenu,
            setExpanded,
        }),
        [
            isMobile,
            isExpanded,
            isMobileOpen,
            isHovered,
            activeItem,
            openSubmenu,
            toggleSidebar,
            toggleMobileSidebar,
            setIsHovered,
            toggleSubmenu,
            setExpanded,
        ]
    );

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export { SidebarContext };
