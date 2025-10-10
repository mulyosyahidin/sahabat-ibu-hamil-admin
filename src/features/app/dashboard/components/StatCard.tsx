import React from "react";

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    count: string | number;
    color: string;
}

export default function StatCard({ icon: Icon, label, count, color }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow dark:shadow-lg p-6 flex items-center gap-4 hover:shadow-lg dark:hover:shadow-lg transition-shadow">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={28} className="text-white" />
            </div>
            <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{count}</p>
            </div>
        </div>
    );
}