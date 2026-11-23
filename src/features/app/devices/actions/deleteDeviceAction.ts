import {ActionFunctionArgs, redirect} from "react-router";
import { api } from "@/lib/api";
import type { ApiError } from "@/types/api";
import {deviceKeys} from "../constants/queryKeys";
import {queryClient} from "@/lib/react-query/queryClient";
import {DeleteDeviceResponse} from "@/features/app/devices/types/device.types";

export async function deleteDeviceAction({ params }: ActionFunctionArgs) {
    const deviceId = params.deviceId;
    if (!deviceId) {
        return new Response(JSON.stringify({ success: false, message: "Device ID tidak ditemukan" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const res = await api.delete<DeleteDeviceResponse>(`/devices/${deviceId}`, {
        validateStatus: () => true,
    });

    if (res.status >= 200 && res.status < 300 && (res.data as any)?.success === true) {
        await queryClient.invalidateQueries({ queryKey: deviceKeys.detail(deviceId), exact: true });
        await queryClient.invalidateQueries({ queryKey: deviceKeys.all, exact: false });

        return redirect("/app/devices");
    }

    if (res.status === 404) {
        await queryClient.invalidateQueries({ queryKey: deviceKeys.detail(deviceId), exact: true });
        await queryClient.invalidateQueries({ queryKey: deviceKeys.all, exact: false });
        return redirect("/app/devices");
    }

    const errPayload: ApiError =
        (res.data && (res.data as any).success === false)
            ? (res.data as ApiError)
            : { success: false, message: "Gagal menghapus device" };

    return new Response(JSON.stringify(errPayload), {
        status: res.status || 400,
        headers: { "Content-Type": "application/json" },
    });
}

