import { StatCard, WeeklyChart } from "@/features/app/dashboard/components";
import { MessageCircle, MessageCircleQuestion, Smartphone } from "lucide-react";
import { useDashboardOverview } from "@/features/app/dashboard/queries";
import { LoadingState, ErrorLoadingState } from "@/components/ui";
import { STAT_CARD_COLORS } from "../constants/dashboard.constants";

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
                        color={STAT_CARD_COLORS.PRIMARY}
                    />
                    <StatCard
                        icon={MessageCircle}
                        label="Chat"
                        count={data.chatCount}
                        color={STAT_CARD_COLORS.PRIMARY}
                    />
                    <StatCard
                        icon={MessageCircleQuestion}
                        label="Konsultasi"
                        count={data.consultationCount}
                        color={STAT_CARD_COLORS.PRIMARY}
                    />
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg shadow dark:shadow-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Jumlah Chat Per Hari (7
                        Hari Terakhir)</h2>

                    <WeeklyChart data={data.chatCountPerDay} />
                </div>
            </div>
        </div>
    );
}
