export const deviceKeys = {
    all: ["devices"] as const,
    list: (params: { page: number; limit: number; q?: string }) =>
        ["devices", "list", params] as const,
    detail: (id: string | number) => ["devices", "detail", { id }] as const,
};
