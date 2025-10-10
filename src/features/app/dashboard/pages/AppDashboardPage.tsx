import StatCard from "@/features/app/dashboard/components/StatCard";
import {MessageCircleQuestion, MessageSquare, Smartphone, Stethoscope} from "lucide-react";
import WeeklyCharts from "@/features/app/dashboard/components/WeeklyChart";
import {useDashboardOverview} from "@/features/app/dashboard/loaders/overview.query";
import LoadingState from "@/components/ui/states/LoadingState";
import ErrorLoadingState from "@/components/ui/states/ErrorLoadingState";

export default function AppDashboardPage() {
    const { data, isLoading, error } = useDashboardOverview();

    if (isLoading) return <LoadingState />
    if (error || !data) return <ErrorLoadingState />

    return (
        <div className="space-y-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        icon={Smartphone}
                        label="Device"
                        count={data.deviceCount}
                        color="bg-pink-500"
                    />
                    <StatCard
                        icon={MessageSquare}
                        label="Chat"
                        count={data.chatCount}
                        color="bg-pink-500"
                    />
                    <StatCard
                        icon={MessageCircleQuestion}
                        label="Konsultasi"
                        count={data.consultationCount}
                        color="bg-pink-500"
                    />
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg shadow dark:shadow-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Jumlah Chat Per Hari (7
                        Hari Terakhir)</h2>

                    <WeeklyCharts data={data.chatCountPerDay} />
                </div>
            </div>
        </div>
    );
}