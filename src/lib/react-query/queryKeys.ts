export const itemsKeys = {
    all: ["items"] as const,
    list: (params: { page: number; q: string }) => ["items", "list", params] as const,
    detail: (id: string|number) => ["items", "detail", { id }] as const,
};
