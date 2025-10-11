import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosError,
    AxiosResponse,
} from "axios";
import type { AxiosHeaders } from "axios";
import {STORAGE_KEYS} from "@/constants/storage";

const rawBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
const BASE_URL = rawBase ? rawBase.replace(/\/+$/, "") : "";

export function getToken(): string | null {
    try {
        return localStorage.getItem(STORAGE_KEYS.auth_token);
    } catch {
        return null;
    }
}

export function setToken(token: string | null) {
    try {
        if (token) localStorage.setItem(STORAGE_KEYS.auth_token, token);
        else localStorage.removeItem(STORAGE_KEYS.auth_token);
    } catch {
        console.log("Failed to set auth token in localStorage");
    }
}

export function clearToken() { setToken(null); }

function setAuthHeader(config: AxiosRequestConfig, token: string) {
    const h = config.headers ?? {};
    if (typeof (h as any).set === "function") {
        (h as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    } else {
        (h as Record<string, any>)["Authorization"] = `Bearer ${token}`;
    }

    config.headers = h;
}

export const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "X-Requested-With": "axios",
        Accept: "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) setAuthHeader(config, token);

    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
        if (err.response?.status === 401) {
            clearToken();

            const isInAuth = location.pathname.startsWith("/auth");
            if (!isInAuth) {
                const redirectTo = encodeURIComponent(location.pathname + location.search);
                window.location.assign(`/auth/login?redirectTo=${redirectTo}`);
            }
        }

        return Promise.reject(err);
    }
);

// ==== Helpers yang mengembalikan .data (untuk React Query) ====
export async function get<T = unknown>(
    url: string,
    cfg?: AxiosRequestConfig & { signal?: AbortSignal }
): Promise<T> {
    const res = await api.get<T>(url, { signal: cfg?.signal, ...cfg });

    return res.data;
}

export async function post<T = unknown, B = unknown>(
    url: string,
    body: B,
    cfg?: AxiosRequestConfig & { signal?: AbortSignal }
): Promise<T> {
    const res = await api.post<T>(url, body, {
        signal: cfg?.signal,
        headers: { "Content-Type": "application/json", ...(cfg?.headers || {}) },
        ...cfg,
    });

    return res.data;
}

export async function postFormData<T = unknown>(
    url: string,
    form: FormData,
    cfg?: AxiosRequestConfig & { signal?: AbortSignal }
): Promise<T> {
    const res = await api.post<T>(url, form, {
        signal: cfg?.signal,
        headers: { ...(cfg?.headers || {}) }, // Axios auto-set boundary
        ...cfg,
    });

    return res.data;
}

export async function del<T = unknown>(
    url: string,
    cfg?: AxiosRequestConfig & { signal?: AbortSignal }
): Promise<T> {
    const res = await api.delete<T>(url, { signal: cfg?.signal, ...cfg });

    return res.data;
}

export async function patch<T = unknown, B = unknown>(
    url: string,
    body: B,
    cfg?: AxiosRequestConfig & { signal?: AbortSignal }
): Promise<T> {
    const res = await api.patch<T>(url, body, {
        signal: cfg?.signal,
        headers: { "Content-Type": "application/json", ...(cfg?.headers || {}) },
        ...cfg,
    });

    return res.data;
}

export async function put<T = unknown, B = unknown>(
    url: string,
    body: B,
    cfg?: AxiosRequestConfig & { signal?: AbortSignal }
): Promise<T> {
    const res = await api.put<T>(url, body, {
        signal: cfg?.signal,
        headers: { "Content-Type": "application/json", ...(cfg?.headers || {}) },
        ...cfg,
    });

    return res.data;
}

// ==== (Opsional) helpers yang mengembalikan AxiosResponse utuh ====
export async function postRes<T = unknown, B = unknown>(
    url: string,
    body: B,
    cfg?: AxiosRequestConfig & { signal?: AbortSignal }
): Promise<AxiosResponse<T>> {
    return api.post<T>(url, body, {
        signal: cfg?.signal,
        headers: { "Content-Type": "application/json", ...(cfg?.headers || {}) },
        validateStatus: () => true,
        ...cfg,
    });
}
export async function getRes<T = unknown>(
    url: string,
    cfg?: AxiosRequestConfig & { signal?: AbortSignal }
): Promise<AxiosResponse<T>> {
    return api.get<T>(url, { signal: cfg?.signal, validateStatus: () => true, ...cfg });
}
