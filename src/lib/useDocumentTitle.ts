import {useEffect} from "react";

export function useDocumentTitle(title: string, opts?: {restoreOnUnmount?: boolean}) {
    useEffect(() => {
        const prev = document.title;
        document.title = title;

        return () => {
            if (opts?.restoreOnUnmount) {
                document.title = prev;
            }
        }
    }, [title, opts?.restoreOnUnmount]);
}
