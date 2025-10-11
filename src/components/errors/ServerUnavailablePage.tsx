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
        <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
            <GridShape/>
            <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
                <img src="/images/error/503.svg" alt="404" className="dark:hidden"/>
                <img
                    src="/images/error/503-dark.svg"
                    alt="404"
                    className="hidden dark:block"
                />

                <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
                    {fallbackMessage ?? (
                        <>
                        Kami tidak bisa terhubung ke server saat ini.{' '}
                        {online ? 'Coba muat ulang.' : 'Periksa koneksi internet Anda.'}
                        </>
                    )}
                </p>

                <button
                    onClick={() => navigate(0)}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                    <RefreshCcw/>
                    <span className="ml-2">Muat Ulang</span>
                </button>
            </div>

            {/* <!-- Footer --> */}
            <div className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
                <div className="flex w-full items-center justify-center gap-2" role="status" aria-live="polite">
                    <span className={`h-2 w-2 rounded-full ${online ? "bg-green-500" : "bg-red-500"}`}/>
                    <span className="text-xs text-gray-600 dark:text-gray-300">{online ? "Online" : "Offline"}</span>
                </div>
            </div>
        </div>
    );
}
