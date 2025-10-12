import {useEffect, useState} from "react";
import { useNavigate} from "react-router";
import { GridShape } from "@/components/shapes";
import {RefreshCcw} from "lucide-react";

type Props = {
    fallbackMessage?: string;
};

export default function ServerUnavailablePage({fallbackMessage}: Props) {
    const navigate = useNavigate();
    const [online, setOnline] = useState<boolean>(navigator.onLine);

    useEffect(() => {
        const onUp = () => setOnline(true);
        const onDown = () => setOnline(false);
        window.addEventListener("online", onUp);
        window.addEventListener("offline", onDown);
        return () => {
            window.removeEventListener("online", onUp);
            window.removeEventListener("offline", onDown);
        };
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden bg-gray-50 dark:bg-gray-900">
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
                <GridShape />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
                <img src="/images/error/503.svg" alt="503" className="dark:hidden mx-auto" />
                <img src="/images/error/503-dark.svg" alt="503" className="hidden dark:block mx-auto" />

                <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
                    {fallbackMessage ?? (
                        <>
                            Kami tidak bisa terhubung ke server saat ini.{" "}
                            {online ? "Coba muat ulang." : "Periksa koneksi internet Anda."}
                        </>
                    )}
                </p>

                <button
                    onClick={() => navigate(0)}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs
                 hover:bg-gray-50 hover:text-gray-800
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200
                 dark:hover:bg-gray-700 dark:hover:text-gray-100
                 dark:focus-visible:ring-blue-400 transition-colors"
                >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    <span>Muat Ulang</span>
                </button>
            </div>

            {/* Footer status */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex w-full items-center justify-center gap-2" role="status" aria-live="polite">
                    <span className={`h-2 w-2 rounded-full ${online ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-300">{online ? "Online" : "Offline"}</span>
                </div>
            </div>
        </div>
    );
}
