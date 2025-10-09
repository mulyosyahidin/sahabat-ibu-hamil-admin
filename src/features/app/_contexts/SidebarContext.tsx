import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

export type SidebarContextValue = {
    /** Sidebar penuh (desktop) */
    isExpanded: boolean;
    /** Sidebar mobile sedang terbuka (overlay) */
    isMobileOpen: boolean;
    /** Pointer sedang hover di area sidebar (untuk expand hover) */
    isHovered: boolean;
    /** Item menu aktif (opsional, untuk highlight) */
    activeItem: string | null;
    /** Submenu yang sedang terbuka */
    openSubmenu: string | null;

    toggleSidebar: () => void;
    toggleMobileSidebar: () => void;
    setIsHovered: (v: boolean) => void;
    setActiveItem: (item: string | null) => void;
    toggleSubmenu: (item: string) => void;
    /** Set langsung expand (mis. saat klik pin icon) */
    setExpanded: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

/** Storage key untuk persist expand (opsional) */
const STORAGE_KEY = "ui.sidebar.expanded";

/** Lebar breakpoint md: <768 dianggap mobile */
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
        // initial ensure
        setIsMobile(mql.matches);
        mql.addEventListener?.("change", handler);
        return () => mql.removeEventListener?.("change", handler);
    }, []);

    return isMobile;
}

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isMobile = useIsMobile();

    // Load preferensi expand dari storage (desktop only)
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

    // Persist expand (desktop only)
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            // Saat mobile, abaikan persist (state expand tidak relevan)
            if (!isMobile) localStorage.setItem(STORAGE_KEY, String(isExpanded));
        } catch {}
    }, [isExpanded, isMobile]);

    // Jika beralih ke desktop, tutup panel mobile
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

export function useSidebar(): SidebarContextValue {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
    return ctx;
}
