import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type BlockingOverlayProps = {
    open: boolean;
    message?: string;
    subMessage?: string;
    zIndexClassName?: string;
    className?: string;
    children?: React.ReactNode;
};

export default function BlockingOverlay({
                                            open,
                                            message = "Memproses...",
                                            subMessage,
                                            zIndexClassName = "z-[9999]",
                                            className,
                                            children,
                                        }: BlockingOverlayProps) {
    useEffect(() => {
        if (!open) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    if (!open) return null;

    const content = (
        <div
            aria-busy="true"
            role="status"
            aria-live="polite"
            className={clsx(
                "fixed inset-0 flex items-center justify-center",
                "backdrop-blur-sm",
                "bg-black/30 dark:bg-black/50",
                zIndexClassName
            )}
        >
            {/* Panel blok klik belakang */}
            <div
                className={clsx(
                    "pointer-events-auto",
                    "mx-4 w-full max-w-md",
                    "rounded-2xl",
                    "bg-white/90 dark:bg-neutral-900/90",
                    "shadow-2xl ring-1 ring-black/5 dark:ring-white/10",
                    "p-6",
                    "flex flex-col items-center text-center gap-3",
                    className
                )}
            >
                {/* Spinner pakai currentColor + warna berbeda di dark */}
                <svg
                    className="h-8 w-8 animate-spin text-pink-600 dark:text-pink-400 motion-reduce:animate-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    aria-label="Memuat"
                    role="img"
                >
                    {/* track */}
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        className="opacity-20"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    {/* arc */}
                    <path
                        d="M4 12a8 8 0 018-8"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>

                {children}

                <div className="space-y-1">
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {message}
                    </p>
                    {subMessage ? (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {subMessage}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
}
