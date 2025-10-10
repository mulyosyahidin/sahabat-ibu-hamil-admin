import { isAbortError, isNetworkError } from "@/utils/net";
import {User} from "@/types/user";
import {authKeys} from "@/features/auth/queryKeys";
import {getRes} from "@/lib/api";

export type MeResponse =
    | { success: true; message: string; data: { user: User } }
    | { success: false; message: string };

export function meQueryOptions() {
    return {
        queryKey: authKeys.me,
        queryFn: async ({ signal }: { signal?: AbortSignal }) => {
            try {
                const res = await getRes<MeResponse>("/auth/me", { signal });

                if (res.status === 401) return null;

                if (res.status >= 200 && res.status < 300) {
                    return res.data.success ? res.data.data.user : null;
                }

                throw new Response(res.data?.message || "Gagal memeriksa sesi autentikasi", {
                    status: res.status || 500,
                });
            } catch (err: any) {
                if (isAbortError(err)) throw err;

                if (isNetworkError(err)) {
                    throw new Response("Layanan tidak tersedia (network).", { status: 503 });
                }

                throw new Response(err?.message || "Terjadi kesalahan tak terduga.", { status: 500 });
            }
        },
        staleTime: 15_000,
    } as const;
}
