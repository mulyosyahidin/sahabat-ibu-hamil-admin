import { queryClient } from "@/lib/react-query/queryClient";
import { DashboardOverviewData } from "@/features/app/dashboard/types/response";
import { dashboardOverviewQueryOptions } from "../queries/overview.query";
import { LoaderFunctionArgs } from "react-router";

export async function loadDashboardOverviewData(
    _args: LoaderFunctionArgs
): Promise<DashboardOverviewData | null> {
    return queryClient.ensureQueryData(dashboardOverviewQueryOptions());
}
