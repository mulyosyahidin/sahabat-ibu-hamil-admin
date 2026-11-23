import {getRes} from "@/lib/api";
import {useQuery, type UseQueryOptions} from "@tanstack/react-query";
import type {ApiError, ApiSuccess} from "@/types/api";
import {ConsultationData, consultationQueryKeys} from "@/features/app/consultations";

export type ConsultationByIdPayload = ConsultationData;
export type ConsultationByIdResponse = ApiSuccess<ConsultationByIdPayload> | ApiError;

export function consultationByIdQueryOptions(id: number | string) {
    const isEnabled =
        typeof id === "number"
            ? id > 0
            : !!(id && String(id).trim().length > 0);

    return {
        queryKey: consultationQueryKeys.detail(id),

        queryFn: async ({signal}: { signal?: AbortSignal }): Promise<ConsultationByIdPayload> => {
            const res = await getRes<ConsultationByIdResponse>(`/consultations/${id}`, {signal});

            if (res.status >= 200 && res.status < 300 && res.data?.success) {
                return res.data.data;
            }

            if (res.status === 404) {
                throw new Error("Consultation tidak ditemukan");
            }
            throw new Error(res.data?.message || "Gagal mengambil detail consultation");
        },

        enabled: isEnabled,
        staleTime: 20_000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (count: number, err: any) => {
            const s = err?.response?.status ?? 0;
            if (s === 404 || (s >= 400 && s < 500)) return false;
            return count < 1;
        },
    } satisfies UseQueryOptions<
        ConsultationByIdPayload,
        Error,
        ConsultationByIdPayload,
        ReturnType<typeof consultationQueryKeys.detail>
    >;
}

export function useConsultationByIdQuery(id: number | string) {
    return useQuery(consultationByIdQueryOptions(id));
}
