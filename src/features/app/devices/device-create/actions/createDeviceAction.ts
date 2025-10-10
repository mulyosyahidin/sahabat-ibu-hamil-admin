import { ApiError, ApiSuccess } from "@/types/api";
import {api} from "@/lib/api";
import {CreateDeviceResponse} from "@/features/app/devices/device-create/types/response";
import {queryClient} from "@/lib/react-query/queryClient";
import {deviceKeys} from "@/features/app/devices/device-index/react-query/queryKeys";

export async function createDeviceAction({ request }: { request: Request }) {
    const fd = await request.formData();
    const name = String(fd.get("name") ?? "").trim();

    if (!name) {
        const payload: ApiError = {
            success: false,
            message: "Validasi gagal",
            errors: { name: ["Nama wajib diisi"] },
        };
        return new Response(JSON.stringify(payload), {
            status: 422,
            headers: { "Content-Type": "application/json" },
        });
    }

    const res = await api.post<CreateDeviceResponse>("/devices", { name }, { validateStatus: () => true });

    if (res.status >= 200 && res.status < 300 && res.data.success) {
        const id = res.data.data.device.id;
        const payload: ApiSuccess<{ id: number|string }> = {
            success: true,
            message: res.data.message,
            data: { id },
        };

        await queryClient.invalidateQueries({ queryKey: deviceKeys.all, exact: false });

        return new Response(JSON.stringify(payload), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    const payload: ApiError =
        res.data && res.data.success === false
            ? res.data
            : { success: false, message: "Gagal menambahkan data" };

    return new Response(JSON.stringify(payload), {
        status: res.status || 400,
        headers: { "Content-Type": "application/json" },
    });
}
