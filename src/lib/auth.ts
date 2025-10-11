import {redirect} from "react-router";
import {api} from "@/lib/api";
import {generateDiceBearUrl} from "@/lib/avatar";

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

export async function requireAuth() {
    const res = await api.get("/auth/me", {validateStatus: () => true});
    if (res.status === 401) {
        return redirect("/auth/login");
    }

    if (res.status < 200 || res.status >= 300) {
        throw new Error("Gagal memuat data user");
    }

    return {
        user: res.data.data,
        avatarUrl: generateDiceBearUrl(res.data.data.user.email, res.data.data.user.name, 44),
    };
}
