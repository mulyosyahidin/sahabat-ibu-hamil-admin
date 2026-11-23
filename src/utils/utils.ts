export const formatDate = (
    input: Date | string | number | null | undefined
): string => {
    if (input == null) return "-";

    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
    }).format(d);
};

export const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
        // Show time for messages within 24 hours
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    } else if (diffInHours < 24 * 7) {
        // Show day and time for messages within a week
        return date.toLocaleDateString('id-ID', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    } else {
        // Show full date for older messages
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
}
