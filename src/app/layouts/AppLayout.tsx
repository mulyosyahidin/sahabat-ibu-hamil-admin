import {Outlet} from "react-router";
import {useTheme} from "@/theme/ThemeProvider";
import {SidebarProvider, useSidebar} from "@/features/app/_contexts/SidebarContext";
import React from "react";
import AppSidebar from "@/features/app/_components/AppSidebar";
import Backdrop from "@/features/app/_components/Backdrop";
import AppHeader from "@/features/app/_components/AppHeader";

const LayoutContent= () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen xl:flex ${theme === 'dark' ? 'dark' : ''}`}>
            <div>
                <AppSidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                } ${isMobileOpen ? "ml-0" : ""} bg-gray-50 dark:bg-gray-900`}
            >
                <AppHeader />
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default function AppLayout() {
    return (
        <SidebarProvider>
           <LayoutContent />
        </SidebarProvider>
    )
}