import { useState, useEffect, useRef } from "react";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { Form, useActionData, useNavigation, useSearchParams } from "react-router";
import Label from "@/components/ui/forms/label";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/button";
import {EyeClosedIcon, EyeIcon} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

type ActionError = {
    success?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

export default function AuthLoginPage() {
    useDocumentTitle("Admin Login");

    const nav = useNavigation();
    const [params] = useSearchParams();
    const actionData = useActionData() as ActionError | undefined;

    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const firstError = (field: string) => actionData?.errors?.[field]?.[0] ?? "";
    const isSubmitting = nav.state === "submitting";

    useEffect(() => {
        if (firstError("email") && emailRef.current) emailRef.current.focus();
        else if (firstError("password") && passwordRef.current) passwordRef.current.focus();
    }, [actionData]);

    return (
        <>
            <div className="flex flex-col flex-1">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <div>
                        <div className="mb-5 sm:mb-8">
                            <div className="group w-8 h-8 bg-pink-600 rounded-xl flex items-center justify-center mb-5">
                                <svg
                                    className="w-4 h-4 text-white transition-transform duration-200 ease-out motion-safe:group-hover:scale-125"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                Selamat Datang!
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Silakan login menggunakan email dan password akun Anda.
                            </p>
                        </div>

                        {actionData?.message && (
                            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-400">
                                {actionData.message}
                            </div>
                        )}

                        <div>
                            <Form method="post" replace className="space-y-6">
                                {params.get("redirectTo") && (
                                    <input type="hidden" name="redirectTo" value={params.get("redirectTo")!} />
                                )}

                                <div>
                                    <Label>
                                        Email <span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        ref={emailRef}
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="Masukkan email Anda"
                                        aria-invalid={!!firstError("email")}
                                        aria-describedby={firstError("email") ? "email-error" : undefined}
                                    />
                                    {firstError("email") && (
                                        <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {firstError("email")}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>
                                        Password <span className="text-error-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            ref={passwordRef}
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            minLength={6}
                                            autoComplete="current-password"
                                            placeholder="Masukkan password Anda"
                                            aria-invalid={!!firstError("password")}
                                            aria-describedby={firstError("password") ? "password-error" : undefined}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute z-30 -translate-y-1/2 right-3 top-1/2 text-sm text-gray-500 dark:text-gray-400"
                                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                        >
                                            {showPassword ? <EyeIcon className="size-5" /> : <EyeClosedIcon className="size-5" />}
                                        </button>
                                    </div>
                                    {firstError("password") && (
                                        <p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {firstError("password")}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Button className="w-full" size="sm" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                                Masuk...
                                            </div>
                                        ) : (
                                            "Masuk"
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>

            <ThemeSwitcher />
        </>
    );
}
