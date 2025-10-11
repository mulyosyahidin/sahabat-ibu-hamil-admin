import {api} from "@/lib/api";
import {redirect} from "react-router";
import {LoginData, LoginResponse} from "@/features/auth/types/auth.types";
import {ApiError} from "@/types/api";
import {STORAGE_KEYS} from "@/constants/storage";

export async function LoginAction({request}: { request: Request }) {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("redirectTo") || "/app/dashboard";

    const formData = await request.formData();

    const res = await api.post<LoginResponse>("/auth/login", {
        email: formData.get("email"),
        password: formData.get("password"),
    }, {validateStatus: () => true});

    if (res.status >= 200 && res.status < 300 && res.data.success) {
        const token = (res.data.data as LoginData).token;
        if (token) localStorage.setItem(STORAGE_KEYS.auth_token, token);

        const user = (res.data.data as LoginData).user;
        localStorage.setItem(STORAGE_KEYS.auth_user_data, JSON.stringify(user));

        return redirect(redirectTo);
    }

    const payload: ApiError =
        res.data && res.data.success === false
            ? res.data
            : {success: false, message: "Gagal login dengan email dan password"};

    return new Response(JSON.stringify(payload), {
        status: res.status || 400,
        headers: {"Content-Type": "application/json"},
    });
}
