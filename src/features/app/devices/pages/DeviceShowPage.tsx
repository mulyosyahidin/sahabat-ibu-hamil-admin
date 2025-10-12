import {Link, useFetcher, useParams} from "react-router";
import {useDeviceQuery} from "@/features/app/devices/queries/device.query";
import { LoadingState, Breadcrumb, ErrorLoadingState, BackButton, EditButton, DeleteButton, BlockingOverlay } from "@/components/ui";
import {getStatusBadge} from "@/utils/ui";
import {formatDate} from "@/utils/utils";
import {useDocumentTitle} from "@/lib/useDocumentTitle";
import {useCallback} from "react";
import Swal from "sweetalert2";
import {DeviceStatus} from "@/features/app/devices/types/device.types";
import {Link2Off, LinkIcon} from "lucide-react";

export default function DeviceShowPage() {
    const { deviceId } = useParams();

    // hapus
    const delFetcher = useFetcher<{ success?: boolean; message?: string }>({ key: "delete-device" });
    const disconnectFetcher = useFetcher<{ success?: boolean; message?: string }>({ key: "disconnect-device" });

    const deleting = delFetcher.state !== "idle";
    const disconnecting = disconnectFetcher.state !== "idle";
    const blocking = deleting || disconnecting;

    const { data: device, isLoading, error } = useDeviceQuery(deviceId!);
    useDocumentTitle(device?.name ?? "Detail Perangkat");

    const requestDelete = useCallback(async (id: number) => {
        const ok = await Swal.fire({
            icon: "warning",
            title: "Apakah Anda yakin?",
            text: "Setelah dihapus, bot tidak dapat menerima dan mengirim pesan. Anda juga tidak bisa menghubungkan kembali perangkat ini.",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
            customClass: { container: "z-[9999]" },
        }).then(r => r.isConfirmed);

        if (!ok) return;

        delFetcher.submit(null, {
            method: "post",
            action: `/app/devices/${id}/delete`,
        });
    }, [delFetcher]);

    const requestDisconnection = useCallback(async (id: number) => {
        const ok = await Swal.fire({
            icon: "warning",
            title: "Apakah Anda yakin?",
            text: "Setelah diputuskan, bot akan berhenti menerima dan mengirim pesan.",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
            reverseButtons: true,
            customClass: { container: "z-[9999]" },
        }).then(r => r.isConfirmed);

        if (!ok) return;

        disconnectFetcher.submit(null, {
            method: "post",
            action: `/app/devices/${id}/disconnect`,
        });
    }, [disconnectFetcher]);

    if (blocking) {
        const msg = deleting ? "Menghapus..." : "Memutus koneksi...";
        const sub = deleting
            ? "Mohon tunggu sampai proses selesai"
            : "Mohon tunggu sampai proses selesai";
        return <BlockingOverlay open message={msg} subMessage={sub} />;
    }

    if (isLoading) return <LoadingState />;
    if (!device || error) return <ErrorLoadingState />

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <Breadcrumb
                    items={[
                        { label: "App", href: "/app/dashboard" },
                        { label: "Devices", href: "/app/devices" },
                        { label: device.name },
                    ]}
                />

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {device.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Detail informasi perangkat WhatsApp
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <DeleteButton handleDelete={() => requestDelete(device.id)} />

                        {(device.status != DeviceStatus.Connected) && (
                            <Link
                                to={`/app/devices/${device.id}/connect`}
                                className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <LinkIcon className="size-4 mr-1" />
                                Connect
                            </Link>
                        )}

                        {device.status === DeviceStatus.Connected && (
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                                onClick={() => requestDisconnection(device.id)}
                            >
                                <Link2Off className="size-4 mr-1" />
                                Disconnect
                            </button>
                        )}
                        
                        <EditButton to={`/app/devices/${device.id}/edit`} />
                        <BackButton to="/app/devices" />
                    </div>
                </div>
            </div>

            {/* Device Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Informasi Device
                    </h2>
                </div>

                <div className="p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">

                        {/* Name */}
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Device</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                {device.name}
                            </dd>
                        </div>

                        {/* Code */}
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Kode Device</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                                {device.code}
                            </dd>
                        </div>

                        {/* Status */}
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                            <dd className="mt-1">
                                {getStatusBadge(device.status)}
                            </dd>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nomor Telepon</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                {device.phone_number || (
                                    <span className="text-gray-400 dark:text-gray-500 italic">Tidak ada</span>
                                )}
                            </dd>
                        </div>

                        {/* Created At */}
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Dibuat</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                {formatDate(device.created_at)}
                            </dd>
                        </div>


                    </dl>
                </div>
            </div>
        </div>
    )
}
