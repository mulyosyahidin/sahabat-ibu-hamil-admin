import {ConsultationStatus} from "@/features/app/consultations";

export type ConsultationStatusBadgeProps = {
    status: ConsultationStatus;
    className?: string;
};

const statusText = (status: ConsultationStatus) => {
    switch (status) {
        case 'WAITING': return 'Menunggu';
        case 'VIEWED':  return 'Dilihat';
        case 'ANSWERED':return 'Dijawab';
        default:        return status;
    }
};

const statusClasses: Record<string, string> = {
    WAITING:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    VIEWED:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ANSWERED:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    DEFAULT:
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export function ConsultationStatusBadge({ status, className = '' }: ConsultationStatusBadgeProps) {
    const color = statusClasses[status] ?? statusClasses.DEFAULT;

    return (
        <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color} ${className}`}
            aria-label={`Status konsultasi: ${statusText(status)}`}
        >
      {statusText(status)}
    </span>
    );
}
