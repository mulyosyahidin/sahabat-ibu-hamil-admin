import { useEffect, useRef, useState } from "react";

export function useMinimumBusy(isBusy: boolean, minMs = 600) {
    const [hold, setHold] = useState(false);
    const startRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isBusy) {
            startRef.current = Date.now();

            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            setHold(true);
        } else {
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

        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isBusy, minMs]);

    return isBusy || hold;
}
