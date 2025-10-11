import {getRes} from "@/lib/api";
import {useQuery, type UseQueryOptions} from "@tanstack/react-query";
import type {ApiError, ApiSuccess} from "@/types/api";
import {ChatData} from "@/features/app/chats/types/chat.types";
import {chatKeys} from "@/features/app/chats/queries/queryKeys";

export type ChatByIdPayload = ChatData;
export type ChatByIdResponse = ApiSuccess<ChatByIdPayload> | ApiError;

export function chatByIdQueryOptions(id: number | string) {
    const isEnabled =
        typeof id === "number"
            ? id > 0
            : !!(id && String(id).trim().length > 0);

    return {
        queryKey: chatKeys.detail(id),

        queryFn: async ({signal}: { signal?: AbortSignal }): Promise<ChatByIdPayload> => {
            const res = await getRes<ChatByIdResponse>(`/chats/${id}`, {signal});

            if (res.status >= 200 && res.status < 300 && res.data?.success) {
                return res.data.data;
            }

            if (res.status === 404) {
                throw new Error("Chat tidak ditemukan");
            }
            throw new Error(res.data?.message || "Gagal mengambil detail chat");
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
        ChatByIdPayload,
        Error,
        ChatByIdPayload,
        ReturnType<typeof chatKeys.detail>
    >;
}

export function useChatByIdQuery(id: number | string) {
    return useQuery(chatByIdQueryOptions(id));
}
