import { authKeys } from "./queryKeys";
import { getRes } from "@/lib/api";
import type { User } from "@/types/user";

export type MeResponse =
    | { success: true; message: string; data: { user: User } }
    | { success: false; message: string };

export function meQueryOptions() {
    return {
        queryKey: authKeys.me,
        queryFn: async ({ signal }: { signal?: AbortSignal }) => {
            const res = await getRes<MeResponse>("/auth/me", { signal });
            if (res.status === 401) return null;
            if (res.status >= 200 && res.status < 300) {
                return res.data.success ? res.data.data.user : null;
            }

            throw new Error(res.data?.message || "Gagal memeriksa sesi authentikasi");
        },
        staleTime: 15_000,
    } as const;
}
