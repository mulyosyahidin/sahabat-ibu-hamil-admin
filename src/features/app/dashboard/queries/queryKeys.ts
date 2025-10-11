export const dashboardQueryKeys = {
    all: ['dashboard'] as const,
    overview: () => [...dashboardQueryKeys.all, 'overview'] as const,
} as const;

export default dashboardQueryKeys;
