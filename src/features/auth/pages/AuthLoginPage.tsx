import { useState, useEffect, useRef, useCallback } from "react";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { Form, useActionData, useNavigation, useSearchParams } from "react-router";
import { Label, Input } from "@/components/ui/forms";
import { Button } from "@/components/ui/buttons";
import {EyeClosedIcon, EyeIcon} from "lucide-react";
import { ThemeSwitcher } from "@/components/common";

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

    const firstError = useCallback((field: string) => actionData?.errors?.[field]?.[0] ?? "", [actionData]);
    const isSubmitting = nav.state === "submitting";

    useEffect(() => {
        if (firstError("email") && emailRef.current) emailRef.current.focus();
        else if (firstError("password") && passwordRef.current) passwordRef.current.focus();
    }, [actionData, firstError]);

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
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Masuk ke Admin Panel
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Silakan masuk dengan akun admin Anda
                            </p>
                        </div>

                        <Form method="post" className="space-y-6">
                            {actionData?.message && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                    {actionData.message}
                                </div>
                            )}

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                        ref={emailRef}
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="mt-1"
                                        defaultValue={params.get("email") ?? ""}
                                        error={!!firstError("email")}
                                    />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative mt-1">
                                    <Input
                                            ref={passwordRef}
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            className="pr-10"
                                            error={!!firstError("password")}
                                        />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeClosedIcon className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Masuk..." : "Masuk"}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <ThemeSwitcher />
            </div>
        </>
    );
}
