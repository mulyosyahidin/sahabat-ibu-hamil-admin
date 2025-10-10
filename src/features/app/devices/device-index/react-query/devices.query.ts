import { deviceKeys } from "./queryKeys";
import { getRes } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { PaginationMeta, ApiError, ApiSuccess } from "@/types/api";
import {Device} from "@/features/app/devices/types";

export type DevicesPayload = {
    items: Device[];
    pagination: PaginationMeta;
};

export type DevicesResponse = ApiSuccess<DevicesPayload> | ApiError;

export type DevicesParams = {
    page: number;
    limit: number;
    q?: string;
};

export function devicesQueryOptions(params: DevicesParams) {
    return {
        queryKey: deviceKeys.list(params),
        queryFn: async ({ signal }: { signal?: AbortSignal }) => {
            const res = await getRes<DevicesResponse>("/devices", {
                signal,
                params,
            });

            if (res.status >= 200 && res.status < 300 && res.data.success) {
                return res.data.data;
            }

            throw new Error(res.data?.message || "Gagal mengambil daftar device");
        },
        staleTime: 20_000,
    } as const;
}

export function useDevicesQuery(params: DevicesParams) {
    return useQuery(devicesQueryOptions(params));
}
