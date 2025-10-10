import {ApiError, ApiSuccess} from "@/types/api";

export interface DashboardOverviewData {
    chatCount: number;
    consultationCount: number;
    deviceCount: number;
    chatCountPerDay: {
        date: string;
        count: number;
        day: string;
    }[];
}

export type DashboardOverviewResponse = ApiSuccess<DashboardOverviewData> | ApiError;
