import type { LoaderFunctionArgs } from "react-router";
import { devicesQueryOptions } from "../queries/devices.query";
import { queryClient } from "@/lib/react-query/queryClient";

export async function loadDevices({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const q = url.searchParams.get("q") || undefined;

    const params = { page, limit, q };

    return queryClient.ensureQueryData(devicesQueryOptions(params));
}
