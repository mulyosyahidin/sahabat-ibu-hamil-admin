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
