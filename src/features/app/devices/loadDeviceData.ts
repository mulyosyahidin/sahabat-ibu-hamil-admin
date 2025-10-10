import type { LoaderFunctionArgs } from "react-router";
import { deviceQueryOptions } from "./device.query";
import {queryClient} from "@/lib/react-query/queryClient";

export async function loadDeviceData({ params }: LoaderFunctionArgs) {
    const deviceId = params.deviceId;
    if (!deviceId) throw new Response("Device ID tidak ditemukan", { status: 404 });

    const idNum = Number(deviceId);
    if (!Number.isFinite(idNum)) throw new Response("Device ID tidak valid", { status: 400 });

    return queryClient.ensureQueryData(deviceQueryOptions(deviceId));
}
