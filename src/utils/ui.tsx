import {DeviceStatus} from "@/features/app/devices/types/device.types";

export const getStatusBadge = (status: string) => {
    const statusConfig = {
        [DeviceStatus.Connected]: {
            label: 'Connected',
            className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        },
        [DeviceStatus.Disconnected]: {
            label: 'Disconnected',
            className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        },
        [DeviceStatus.PendingConnect]: {
            label: 'Pending Connect',
            className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        },
        [DeviceStatus.Reconnecting]: {
            label: 'Reconnecting',
            className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        },
        [DeviceStatus.FailedConnect]: {
            label: 'Failed Connect',
            className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
        },
        [DeviceStatus.Draft]: {
            label: 'Draft',
            className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        }
    };

    const config = statusConfig[status as DeviceStatus];
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
};

export const getChatStatusBadge = (currentStack: string) => {
    const stackConfig = {
        'registrasi': { label: 'Registrasi', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
        'menu.root': { label: 'Menu Utama', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
        'menu.anemia': { label: 'Menu Anemia', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
        'menu.ttd': { label: 'Menu TTD', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
        'menu.nutrition': { label: 'Menu Nutrisi', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
        'menu.myths': { label: 'Menu Mitos', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
        'menu.reminder': { label: 'Menu Reminder', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
        'menu.family': { label: 'Menu Keluarga', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
        'menu.faq': { label: 'Menu FAQ', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' },
        'menu.profile': { label: 'Menu Profil', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
        'reminder.time_selection': { label: 'Pilih Waktu Reminder', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
        'reminder.deactivation_selection': { label: 'Nonaktifkan Reminder', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
        'reminder.custom_time': { label: 'Waktu Custom', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
        'profile.edit_name': { label: 'Edit Nama', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
        'profile.edit_age': { label: 'Edit Umur', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
        'profile.delete_confirmation': { label: 'Konfirmasi Hapus', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
        'faq.answering': { label: 'Menjawab FAQ', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' },
        'menu.consultation': { label: 'Menu Konsultasi', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' },
        'consultation.asking': { label: 'Bertanya Konsultasi', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' },
        'consultation.viewing': { label: 'Lihat Konsultasi', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' },
        'consultation.viewing.detail': { label: 'Detail Konsultasi', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' }
    };

    const config = stackConfig[currentStack as keyof typeof stackConfig] || {
        label: currentStack || 'Unknown',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };

    return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
};
