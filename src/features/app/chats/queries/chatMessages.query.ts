import {ChatMessage} from "@/features/app/chats/types/chat.types";
import {chatMessageKeys} from "@/features/app/chats/constants/queryKeys";
import {getRes} from "@/lib/api";
import {useInfiniteQuery, UseInfiniteQueryOptions} from "@tanstack/react-query";

type ChatMessagesCursorPayload = {
    messages: ChatMessage[];
    messageCount: number;
    nextCursor: number | null;
    hasMore: boolean;
};

type ChatMessagesCursorResponse = {
    success: boolean;
    message?: string;
    data: ChatMessagesCursorPayload;
};

export function chatMessagesInfiniteQueryOptions(
    chatId: number | string,
    limit: number = 20
) {
    const isEnabled =
        typeof chatId === 'number'
            ? chatId > 0
            : !!(chatId && String(chatId).trim().length > 0);

    return {
        queryKey: chatMessageKeys.infinite(chatId, limit),

        queryFn: async ({
                            pageParam,
                            signal,
                        }: {
            pageParam?: number | null;
            signal?: AbortSignal;
        }): Promise<ChatMessagesCursorPayload> => {
            const cursor =
                typeof pageParam === 'number'
                    ? pageParam
                    : pageParam == null
                        ? undefined
                        : Number(pageParam);

            const res = await getRes<ChatMessagesCursorResponse>(
                `/chats/${chatId}/messages`,
                {
                    signal,
                    params: {cursor, limit},
                }
            );

            if (res.status >= 200 && res.status < 300 && res.data?.success) {
                return res.data.data;
            }

            if (res.status === 404) {
                throw new Error('Chat atau pesan tidak ditemukan');
            }

            throw new Error(res.data?.message || 'Gagal mengambil daftar pesan');
        },

        initialPageParam: null as number | null,
        getNextPageParam: (lastPage) =>
            lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,

        enabled: isEnabled,
        staleTime: 20_000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (count: number, err: any) => {
            const s = err?.response?.status ?? 0;
            if (s === 404 || (s >= 400 && s < 500)) return false;
            return count < 1;
        },
    } satisfies UseInfiniteQueryOptions<
        ChatMessagesCursorPayload,
        Error,
        ChatMessagesCursorPayload,
        ReturnType<typeof chatMessageKeys.infinite>,
        number | null
    >;
}

export function useChatMessagesInfiniteQuery(chatId: number | string, limit = 20) {
    return useInfiniteQuery(chatMessagesInfiniteQueryOptions(chatId, limit));
}
