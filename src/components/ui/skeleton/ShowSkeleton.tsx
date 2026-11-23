import React from "react";

export default function ShowSkeleton() {
    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-3">
                    <SkelPill className="w-16" />
                    <span className="text-gray-400">/</span>
                    <SkelPill className="w-20" />
                    <span className="text-gray-400">/</span>
                    <SkelPill className="w-28" />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <SkelBox className="h-7 w-56" />
                        <SkelBox className="h-4 w-72" />
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Delete */}
                        <SkelBtn className="w-28" />
                        {/* Connect/Disconnect (hanya salah satu di real UI, tapi skeleton tampilkan keduanya aman) */}
                        <SkelBtn className="w-32" />
                        {/* Edit */}
                        <SkelBtn className="w-24" />
                        {/* Back */}
                        <SkelBtn className="w-24" />
                    </div>
                </div>
            </div>

            {/* Device Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <SkelBox className="h-5 w-44" />
                </div>

                <div className="p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        {/* Name */}
                        <FieldSkeleton labelW="w-28" valueW="w-48" />
                        {/* Code */}
                        <FieldSkeleton labelW="w-28" valueW="w-40" mono />
                        {/* Status (badge) */}
                        <div>
                            <SkelLabel className="w-20" />
                            <div className="mt-1">
                                <SkelPill className="w-24 h-6" />
                            </div>
                        </div>
                        {/* Phone Number */}
                        <FieldSkeleton labelW="w-28" valueW="w-32" />
                        {/* Created At */}
                        <FieldSkeleton labelW="w-20" valueW="w-40" />
                    </dl>
                </div>
            </div>
        </div>
    );
}

/* ---------- Atoms ---------- */
function SkelBox({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`} aria-hidden />;
}

function SkelPill({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 h-5 ${className}`} aria-hidden />;
}

function SkelBtn({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse h-10 rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`} aria-hidden />;
}

function SkelLabel({ className = "" }: { className?: string }) {
    return <div className={`h-3 rounded bg-gray-200 dark:bg-gray-700 ${className}`} aria-hidden />;
}

/* ---------- Molecule ---------- */
function FieldSkeleton({
                           labelW = "w-24",
                           valueW = "w-52",
                           mono = false,
                       }: {
    labelW?: string;
    valueW?: string;
    mono?: boolean;
}) {
    return (
        <div>
            <SkelLabel className={` ${labelW}`} />
            <div className={`mt-2`}>
                <SkelBox className={`h-4 ${valueW} ${mono ? "rounded-sm" : ""}`} />
            </div>
        </div>
    );
}
