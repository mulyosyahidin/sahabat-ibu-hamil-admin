// Dashboard-related constants and configuration values

// Query configuration
export const DASHBOARD_STALE_TIME = 5 * 60 * 1000; // 5 minutes

// Chart configuration
export const CHART_CONFIG = {
    STROKE_WIDTH: 2,
    STROKE_COLOR: '#db2777',
    GRADIENT_OPACITY_FROM: 0.4,
    GRADIENT_OPACITY_TO: 0.01,
    GRADIENT_STOPS: [0, 100],
    MARKER_SIZE: 4,
    MARKER_STROKE_WIDTH: 0,
    MARKER_COLOR: '#db2777',
} as const;

// Chart colors for light/dark theme
export const CHART_COLORS = {
    LIGHT: {
        GRID: '#e5e7eb',
        AXIS: '#9ca3af',
    },
    DARK: {
        GRID: '#334155',
        AXIS: '#9ca3af',
    },
} as const;

// StatCard default colors
export const STAT_CARD_COLORS = {
    PRIMARY: 'bg-pink-500',
    SECONDARY: 'bg-blue-500',
    SUCCESS: 'bg-green-500',
    WARNING: 'bg-yellow-500',
    DANGER: 'bg-red-500',
} as const;

// Dashboard API endpoints
export const DASHBOARD_ENDPOINTS = {
    OVERVIEW: '/overview',
} as const;

// Error messages
export const DASHBOARD_ERROR_MESSAGES = {
    FAILED_TO_FETCH_OVERVIEW: 'Gagal mengambil data overview dashboard',
} as const;
