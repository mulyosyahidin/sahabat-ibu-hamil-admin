import {getRes} from "@/lib/api";
import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import type {ApiError, ApiSuccess, PaginationMeta} from "@/types/api";
import { ChatData} from "@/features/app/chats/types/chat.types";
import {chatKeys} from "@/features/app/chats";

export type ChatsPayload = {
    items: ChatData[];
    pagination: PaginationMeta;
};

export type ChatsResponse = ApiSuccess<ChatsPayload> | ApiError;

export type ChatsParams = {
    page: number;
    limit: number;
    q?: string;
};

export function chatsQueryOptions({page, limit, q}: ChatsParams) {
    const qNorm = q ?? '';

    return {
        queryKey: chatKeys.list(page, limit, qNorm),

        queryFn: async ({signal}: { signal?: AbortSignal }): Promise<ChatsPayload> => {
            const res = await getRes<ChatsResponse>('/chats', {
                signal,
                params: {page, limit, q: qNorm || undefined},
            });
            if (res.status >= 200 && res.status < 300 && res.data?.success) {
                return res.data.data;
            }
            throw new Error(res.data?.message || 'Gagal mengambil daftar chat');
        },

        staleTime: 20_000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        placeholderData: (prev: ChatsPayload | undefined) => prev,
        retry: (count: number, err: any) => {
            const status = err?.response?.status ?? 0;
            if (status >= 400 && status < 500) return false;
            return count < 1;
        },
    } satisfies UseQueryOptions<
        ChatsPayload,
        Error,
        ChatsPayload,
        ReturnType<typeof chatKeys.list>
    >;
}

export function useChatsQuery(params: ChatsParams) {
    return useQuery(chatsQueryOptions(params));
}
