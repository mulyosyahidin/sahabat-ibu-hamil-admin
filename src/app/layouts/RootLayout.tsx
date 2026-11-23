import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { meQueryOptions } from "@/features/auth/queries/me.query";
import { BlockingOverlay } from "@/components/ui";
import { isNetworkError } from "@/utils/net";

export default function RootLayout() {
    const { isLoading, isError, error } = useQuery(meQueryOptions());

    if (isLoading) {
        return <BlockingOverlay open message="Menghubungkan..." subMessage="Mohon menunggu, sedang menghubungkan aplikasi ke server" />;
    }

    if (isError) {
        const err = error as any;
        if (isNetworkError(err)) throw new Response("Layanan tidak tersedia (network).", { status: 503 });

        throw new Response(err?.message || "Gagal memeriksa sesi autentikasi", { status: 500 });
    }

    return <Outlet />;
}
