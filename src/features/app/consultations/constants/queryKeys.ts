export const consultationQueryKeys = {
    all: ['consultations'] as const,
    lists: () => [...consultationQueryKeys.all, 'list'] as const,
    list: (page: number, limit: number, q: string) =>
        [...consultationQueryKeys.lists(), page, limit, q] as const,
    details: () => [...consultationQueryKeys.all, 'detail'] as const,
    detail: (id: number | string) => [...consultationQueryKeys.details(), id] as const,
};