import {DeviceStatus} from "@/features/app/devices/types";

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