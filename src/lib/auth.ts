import {redirect} from "react-router";
import {api} from "@/lib/api";

/**
 * Guard untuk cabang /auth (login/forgot).
 * - Jika SUDAH login -> redirect ke "/"
 * - Jika BELUM login -> lanjut render halaman auth
 */
export async function requireGuest() {
    const res = await api.get("/auth/me", {validateStatus: () => true});
    if (res.status >= 200 && res.status < 300) {
        return redirect("/app/dashboard");
    }

    return null;
}
