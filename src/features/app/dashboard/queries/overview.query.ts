import { dashboardQueryKeys } from "./queryKeys";
import { getRes } from "@/lib/api";
import { DashboardOverviewResponse } from "@/features/app/dashboard/types/response";
import { ApiError } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_STALE_TIME, DASHBOARD_ERROR_MESSAGES } from "../constants/dashboard.constants";

export function dashboardOverviewQueryOptions() {
    return {
        queryKey: dashboardQueryKeys.overview(),
        queryFn: async ({ signal }: { signal?: AbortSignal }) => {
            const res = await getRes<DashboardOverviewResponse>('/overview', { signal });
            if (res.status >= 200 && res.status < 300 && res.data.success) {
                return res.data.data;
            }

            const msg = (res.data as ApiError)?.message || DASHBOARD_ERROR_MESSAGES.FAILED_TO_FETCH_OVERVIEW;
            throw new Error(msg);
        },
        staleTime: DASHBOARD_STALE_TIME,
    } as const;
}

export function useDashboardOverview() {
    return useQuery(dashboardOverviewQueryOptions());
}
