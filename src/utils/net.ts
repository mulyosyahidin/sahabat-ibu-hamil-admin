export function isNetworkError(err: unknown): boolean {
    const e = err as any;
    const msg: string = e?.message ?? "";

    // Axios network error: e.request ada tapi e.response tidak
    const axiosNet = !!e?.isAxiosError && !!e?.request && !e?.response;

    // fetch() / browser: TypeError("Failed to fetch") atau "Network Error"
    const fetchNet =
        (e instanceof TypeError && /Failed to fetch/i.test(msg)) ||
        /Network\s*Error/i.test(msg);

    return axiosNet || fetchNet;
}

export function isAbortError(err: unknown): boolean {
    return (err as any)?.name === "AbortError";
}
