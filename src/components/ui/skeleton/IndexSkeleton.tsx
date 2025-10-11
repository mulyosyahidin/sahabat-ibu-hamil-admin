import React from "react";

type Props = { rows?: number };

export default function IndexSkeleton({ rows = 8 }: Props) {
    return (
        <div className="p-6 space-y-4">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <SkeletonBox className="h-6 w-48" />
                    <SkeletonBox className="h-4 w-72" />
                </div>
                <SkeletonBox className="h-10 w-40 rounded-lg" />
            </div>

            {/* Table skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="max-w-full overflow-x-auto">
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-6 gap-2 px-6 py-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonBox key={i} className="h-3 w-24" />
                            ))}
                        </div>
                    </div>

                    {/* Rows */}
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {Array.from({ length: rows }).map((_, idx) => (
                            <li
                                key={idx}
                                className="grid grid-cols-6 items-center gap-2 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                {/* # */}
                                <SkeletonBox className="h-4 w-6" />
                                {/* Nama */}
                                <div className="space-y-2">
                                    <SkeletonBox className="h-4 w-40" />
                                    <SkeletonBox className="h-3 w-24" />
                                </div>
                                {/* Kode */}
                                <SkeletonBox className="h-4 w-24" />
                                {/* Status badge */}
                                <SkeletonPill className="w-20" />
                                {/* No HP */}
                                <SkeletonBox className="h-4 w-28" />
                                {/* Actions (kanan) */}
                                <div className="flex justify-end gap-2">
                                    <SkeletonCircle className="h-9 w-9" />
                                    <SkeletonCircle className="h-9 w-9" />
                                    <SkeletonCircle className="h-9 w-9" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between">
                <SkeletonBox className="h-9 w-24" />
                <SkeletonBox className="h-4 w-28" />
                <div className="flex gap-2">
                    <SkeletonBox className="h-9 w-20" />
                    <SkeletonBox className="h-9 w-20" />
                </div>
            </div>
        </div>
    );
}

/* ---- Primitive skeleton atoms ---- */
function SkeletonBox({ className = "" }: { className?: string }) {
    return (
        <div
            className={
                "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 " + className
            }
            aria-hidden
        />
    );
}

function SkeletonCircle({ className = "" }: { className?: string }) {
    return (
        <div
            className={
                "animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 " + className
            }
            aria-hidden
        />
    );
}

function SkeletonPill({ className = "" }: { className?: string }) {
    return (
        <div
            className={
                "animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 h-6 " +
                className
            }
            aria-hidden
        />
    );
}
