// Chat-related constants and configuration values

// Default pagination values
export const DEFAULT_CHAT_PAGE = 1;
export const DEFAULT_CHAT_LIMIT = 10;
export const DEFAULT_MESSAGES_LIMIT = 20;

// Query configuration
export const CHAT_STALE_TIME = 20_000; // 20 seconds
export const CHAT_GC_TIME = 5 * 60 * 1000; // 5 minutes

// UI constants
export const SCROLL_THRESHOLD = 80; // pixels from bottom to trigger auto-scroll

// Chat status configuration
export const CHAT_STATUS_CONFIG = {
    'registrasi': { 
        label: 'Registrasi', 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
    },
    'menu.root': { 
        label: 'Menu Utama', 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
    },
    'menu.anemia': { 
        label: 'Menu Anemia', 
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
    },
    'menu.ttd': { 
        label: 'Menu TTD', 
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
    },
    'menu.nutrition': { 
        label: 'Menu Nutrisi', 
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
    },
    'menu.myths': { 
        label: 'Menu Mitos', 
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' 
    },
    'menu.reminder': { 
        label: 'Menu Reminder', 
        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
    },
    'menu.family': { 
        label: 'Menu Keluarga', 
        color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' 
    },
    'menu.faq': { 
        label: 'Menu FAQ', 
        color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' 
    },
    'menu.profile': { 
        label: 'Menu Profil', 
        color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' 
    },
    'reminder.time_selection': { 
        label: 'Pilih Waktu Reminder', 
        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
    },
    'reminder.confirmation': { 
        label: 'Konfirmasi Reminder', 
        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
    },
    'consultation': { 
        label: 'Konsultasi', 
        color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
    },
} as const;

// Default status for unknown chat states
export const DEFAULT_CHAT_STATUS = {
    label: 'Unknown',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
} as const;

// API endpoints
export const CHAT_ENDPOINTS = {
    CHATS: '/chats',
    CHAT_BY_ID: (id: number | string) => `/chats/${id}`,
    CHAT_MESSAGES: (chatId: number | string) => `/chats/${chatId}/messages`,
} as const;

// Error messages
export const CHAT_ERROR_MESSAGES = {
    CHAT_NOT_FOUND: 'Chat tidak ditemukan',
    FAILED_TO_FETCH_CHAT: 'Gagal mengambil detail chat',
    FAILED_TO_FETCH_CHATS: 'Gagal mengambil daftar chat',
    FAILED_TO_FETCH_MESSAGES: 'Gagal mengambil pesan chat',
} as const;
