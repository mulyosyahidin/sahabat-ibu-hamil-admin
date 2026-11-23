import { useQuery } from "@tanstack/react-query";
import { getRes } from "@/lib/api";
import type { ApiError, ApiSuccess } from "@/types/api";
import {deviceKeys} from "../constants/queryKeys";
import {Device} from "@/features/app/devices/types/device.types";

type DeviceResponse = ApiSuccess<{ device: Device }> | ApiError;

export function deviceQueryOptions(id: string | number) {
    return {
        queryKey: deviceKeys.detail(id),
        queryFn: async ({ signal }: { signal?: AbortSignal }) => {
            const res = await getRes<DeviceResponse>(`/devices/${id}`, { signal });
            if (res.status >= 200 && res.status < 300 && res.data.success) {
                return res.data.data.device;
            }

            const msg = (res.data as ApiError)?.message || "Gagal mengambil detail device";
            throw new Error(msg);
        },
        staleTime: 20_000,
    } as const;
}

export function useDeviceQuery(id: string | number) {
    return useQuery(deviceQueryOptions(id));
}
