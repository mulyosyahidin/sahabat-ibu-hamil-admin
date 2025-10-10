import {queryClient} from "@/lib/react-query/queryClient";
import {DashboardOverviewData} from "@/features/app/dashboard/types/response";
import { dashboardOverviewQueryOptions } from "./overview.query";
import {LoaderFunctionArgs, redirect} from "react-router";

export async function loadDashboardOverviewData(
    args: LoaderFunctionArgs
): Promise<DashboardOverviewData | null> {
    return queryClient.ensureQueryData(dashboardOverviewQueryOptions());
}