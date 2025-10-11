import {ApiError, ApiSuccess, PaginationMeta} from "@/types/api";
import {ConsultationData, consultationQueryKeys} from "@/features/app/consultations";
import {getRes} from "@/lib/api";
import {useQuery, UseQueryOptions } from "@tanstack/react-query";

export type ConsultationsPayload = {
    items: ConsultationData[],
    pagination: PaginationMeta;
};

export type ConsultationsResponse = ApiSuccess<ConsultationsPayload> | ApiError;

export type ConsultationsParams = {
    page: number;
    limit: number;
    q?: string;
};

export function consultationsQueryOptions({page, limit, q}: ConsultationsParams) {
    const qNorm = q ?? '';

    return {
        queryKey: consultationQueryKeys.list(page, limit, qNorm),

        queryFn: async ({signal}: { signal?: AbortSignal }): Promise<ConsultationsPayload> => {
            const res = await getRes<ConsultationsResponse>('/consultations', {
                signal,
                params: {page, limit, q: qNorm || undefined},
            });
            if (res.status >= 200 && res.status < 300 && res.data?.success) {
                return res.data.data;
            }
            throw new Error(res.data?.message || 'Gagal mengambil daftar konsultasi');
        },

        staleTime: 20_000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        placeholderData: (prev: ConsultationsPayload | undefined) => prev,
        retry: (count: number, err: any) => {
            const status = err?.response?.status ?? 0;
            if (status >= 400 && status < 500) return false;
            return count < 1;
        },
    } satisfies UseQueryOptions<
        ConsultationsPayload,
        Error,
        ConsultationsPayload,
        ReturnType<typeof consultationQueryKeys.list>
    >;
}

export function useConsultationsQuery(params: ConsultationsParams) {
    return useQuery(consultationsQueryOptions(params));
}