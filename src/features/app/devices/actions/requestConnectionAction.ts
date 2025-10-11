import {ActionFunctionArgs} from "react-router";
import {api} from "@/lib/api";
import {RequestConnectionResponse} from "@/features/app/devices/types/device.types";
import {queryClient} from "@/lib/react-query/queryClient";
import {deviceKeys} from "../constants/queryKeys";
import type {ApiError} from "@/types/api";

export async function requestConnectionAction({ params }: ActionFunctionArgs) {
    const deviceId = params.deviceCode;
    if (!deviceId) {
        return new Response(JSON.stringify({ success: false, message: "Device ID tidak ditemukan" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const res = await api.post<RequestConnectionResponse>(`/devices/${deviceId}/request-connection`, {
        validateStatus: () => true,
    });

    if (res.status >= 200 && res.status < 300 && (res.data as any)?.success === true) {
        await queryClient.invalidateQueries({ queryKey: deviceKeys.detail(deviceId), exact: true });

        return new Response(JSON.stringify(res, null, 2));
    }

    if (res.status === 404) {
        await queryClient.invalidateQueries({ queryKey: deviceKeys.detail(deviceId), exact: true });
        await queryClient.invalidateQueries({ queryKey: deviceKeys.all, exact: false });

        return new Response(JSON.stringify({ success: false, message: "Device tidak ditemukan" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const payload: ApiError =
        res.data && res.data.success === false
            ? res.data
            : { success: false, message: "Gagal meminta koneksi" };

    return new Response(JSON.stringify(payload), {
        status: res.status || 400,
        headers: { "Content-Type": "application/json" },
    });
}
