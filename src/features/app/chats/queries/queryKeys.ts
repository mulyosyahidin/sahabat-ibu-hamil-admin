export const chatKeys = {
    all: ['chats'] as const,
    lists: () => [...chatKeys.all, 'list'] as const,
    list: (page: number, limit: number, q: string) =>
        [...chatKeys.lists(), page, limit, q] as const,
    details: () => [...chatKeys.all, 'detail'] as const,
    detail: (id: number | string) => [...chatKeys.details(), id] as const,
};

export const chatMessageKeys = {
    all: ['chats', 'messages'] as const,
    lists: (chatId: number | string) => [...chatMessageKeys.all, 'list', chatId] as const,
    infinite: (chatId: number | string, limit: number) =>
        [...chatMessageKeys.lists(chatId), 'infinite', limit] as const,
    details: (chatId: number | string) => [...chatMessageKeys.all, 'detail', chatId] as const,
    detail: (chatId: number | string, messageId: number | string) =>
        [...chatMessageKeys.details(chatId), messageId] as const,
}
