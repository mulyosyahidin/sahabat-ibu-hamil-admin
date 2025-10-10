import {dashboardQueryKeys} from "@/features/app/dashboard/loaders/queryKeys";
import { getRes } from "@/lib/api";
import {DashboardOverviewResponse} from "@/features/app/dashboard/types/response";
import {ApiError} from "@/types/api";
import {useQuery} from "@tanstack/react-query";

export function dashboardOverviewQueryOptions() {
    return {
        queryKey: dashboardQueryKeys.overview(),
        queryFn: async ({ signal }: { signal?: AbortSignal }) => {
            const res = await getRes<DashboardOverviewResponse>('/overview', { signal });
            if (res.status >= 200 && res.status < 300 && res.data.success) {
                return res.data.data;
            }

            const msg = (res.data as ApiError)?.message || 'Gagal mengambil data overview dashboard';
            throw new Error(msg);
        },
        staleTime: 5 * 60 * 1000,
    } as const;
}

export function useDashboardOverview() {
    return useQuery(dashboardOverviewQueryOptions());
}