import { useEffect, useRef, useState } from "react";

/** Menahan busy minimal `minMs` setelah status berubah dari busy -> idle */
export function useMinimumBusy(isBusy: boolean, minMs = 600) {
    const [hold, setHold] = useState(false);
    const startRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isBusy) {
            // mulai busy
            startRef.current = Date.now();
            // pastikan tidak ada timer tertinggal
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            setHold(true);
        } else {
            // selesai busy → cek apakah perlu ditahan
            const started = startRef.current ?? Date.now();
            const elapsed = Date.now() - started;
            const remain = Math.max(0, minMs - elapsed);

            if (remain === 0) {
                setHold(false);
                startRef.current = null;
            } else {
                timerRef.current = window.setTimeout(() => {
                    setHold(false);
                    startRef.current = null;
                    timerRef.current = null;
                }, remain) as unknown as number;
            }
        }

        // cleanup saat unmount
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isBusy, minMs]);

    // overlay aktif jika sedang busy ATAU masih di-hold
    return isBusy || hold;
}
