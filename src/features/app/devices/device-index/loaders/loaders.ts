import {DevicesParams, devicesQueryOptions} from "@/features/app/devices/device-index/react-query/devices.query";
import {queryClient} from "@/lib/react-query/queryClient";

/**
 * Loader untuk route index devices.
 * Membaca query string ?page=&limit=&q= lalu prefetch cache React Query.
 * Mengembalikan payload { data: Device[], pagination } sebagai nilai loader.
 */
export async function loadDevices({ request }: { request: Request }) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);
    const q = url.searchParams.get("q") ?? undefined;

    const params: DevicesParams = { page, limit, q };

    return queryClient.ensureQueryData(devicesQueryOptions(params));
}
