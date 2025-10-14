import { useFetcher, useNavigate, useParams} from "react-router";
import { Breadcrumb, BackButton, LoadingState, ErrorLoadingState } from "@/components/ui";
import { Label, Input } from "@/components/ui/forms";
import { useEffect, useRef, useCallback } from "react";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import Swal from "sweetalert2";
import {useDeviceQuery} from "@/features/app/devices/queries/device.query";

type ActionError = {
    success?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

type ActionSuccess = {
    success: true;
    message: string;
    data: { id: string | number };
};

export default function DeviceEditPage() {
    const { deviceId } = useParams();
    const { data: device, isLoading, error } = useDeviceQuery(deviceId!);

    useDocumentTitle(device?.name || "Edit Device");

    const fetcher = useFetcher<ActionError | ActionSuccess>();
    const nameRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const isSubmitting = fetcher.state === "submitting";
    const data = fetcher.data;

    const firstError = useCallback((field: string) =>
        (data as ActionError | undefined)?.errors?.[field]?.[0] ?? "", [data]);

    useEffect(() => {
        if (firstError("name") && nameRef.current) nameRef.current.focus();
    }, [data, firstError]);

    useEffect(() => {
        const d = data as ActionSuccess | undefined;
        if (d?.success) {
            void Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: d.message || "Berhasil menyimpan data",
                confirmButtonText: "OK",
            });
        }
    }, [data, navigate]);

    if (isLoading) return <LoadingState />;
    if (!device || error) return <ErrorLoadingState />

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <Breadcrumb
                            scrollOnMobile
                            className="block truncate"
                            items={[
                                { label: "App", href: "/app/dashboard" },
                                { label: "Devices", href: "/app/devices" },
                                { label: device.name, href: `/app/devices/${device.id}` },
                                { label: "Edit" },
                            ]}
                        />
                    </div>

                    <BackButton
                        to={`/app/devices/${device.id}`}
                        className="shrink-0 self-start sm:self-auto"
                    />
                </div>

                <h1 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
                    Edit Data Device
                </h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <fetcher.Form method="post" className="p-6 space-y-6">
                    {data && !("success" in data && data.success) && (data as ActionError)?.message && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-400">
                            {(data as ActionError).message}
                        </div>
                    )}

                    <div>
                        <Label>
                            Nama Device <span className="text-error-500">*</span>
                        </Label>
                        <Input
                            ref={nameRef}
                            name="name"
                            type="text"
                            defaultValue={device.name}
                            required
                            autoComplete="name"
                            placeholder="Masukkan nama device WhatsApp"
                            aria-invalid={!!firstError("name")}
                            aria-describedby={firstError("name") ? "name-error" : undefined}
                        />
                        {firstError("name") && (
                            <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {firstError("name")}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan"
                            )}
                        </button>
                    </div>
                </fetcher.Form>
            </div>
        </div>
    );
}
