import {createSearchParams, Link, useFetcher, useNavigate, useSearchParams} from "react-router";
import {useDevicesQuery} from "@/features/app/devices/queries/devices.query";
import EmptyDevicesState from "@/features/app/devices/components/EmptyDevicesState";
import { PageHeader, LoadingState, ErrorLoadingState, Pagination, RowDeleteButton, BlockingOverlay } from "@/components/ui";
import {Eye, Pencil} from "lucide-react";
import {useDocumentTitle} from "@/lib/useDocumentTitle";
import {useCallback} from "react";
import Swal from "sweetalert2";
import {getStatusBadge} from "@/utils/ui";
import {useMinimumBusy} from "@/features/app/devices/hooks/device.hooks";

export default function DeviceIndexPage() {
    useDocumentTitle("WhatsApp Devices");

    const [sp] = useSearchParams();
    const navigate = useNavigate();

    const page = Number(sp.get("page") ?? 1);
    const limit = Number(sp.get("limit") ?? 10);
    const q = sp.get("q") ?? undefined;

    const {data, isLoading, error} = useDevicesQuery({page, limit, q});

    const delFetcher = useFetcher<{ success?: boolean; message?: string }>(
        {key: "delete-device"}
    );

    const devices = data!.items;
    const pagination = data!.pagination;

    const deleting = delFetcher.state !== "idle";
    const showDeletingOverlay = useMinimumBusy(deleting, 2000);

    const requestDelete = useCallback(async (id: string | number, title?: string, message?: string) => {
        const ok = await Swal.fire({
            icon: "warning",
            title: title || "Apakah Anda yakin?",
            text: message || "Tindakan ini tidak dapat dibatalkan!",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
            customClass: {container: "z-[9999]"},
        }).then(r => r.isConfirmed);

        if (!ok) return;

        delFetcher.submit(null, {
            method: "post",
            action: `/app/devices/${id}/delete`,
        });
    }, [delFetcher]);

    if (isLoading) return <LoadingState/>;
    if (error) return <ErrorLoadingState/>;

    if (showDeletingOverlay) {
        return <BlockingOverlay open={true} message="Menghapus..." subMessage="Mohon tunggu sampai proses selesai" />
    }

    return (
        <div className="p-6">
            {/* Header */}
            <PageHeader title="WhatsApp Devices" description="Kelola perangkat WhatsApp yang terhubung"
                        navigateTo="/app/devices/create"/>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                {devices.length == 0 && <EmptyDevicesState/>}

                {devices.length > 0 && (
                    <div
                        className="overflow-hidden border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 rounded-t-lg">
                        <div className="max-w-full overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                {/* Table Header */}
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Kode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        No. HP
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Tindakan
                                    </th>
                                </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody
                                    className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                                {devices.map((device, index) => (
                                    <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {(page - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-600 dark:text-white">
                                                {device.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {device.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(device.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {device.phone_number || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex w-full justify-end space-x-2">
                                                <Link
                                                    to={`/app/devices/${device.id}`}
                                                    aria-label="View device"
                                                    title="View"
                                                    className="btn-icon btn-icon-view"
                                                >
                                                    <Eye className="h-4 w-4" aria-hidden/>
                                                    <span className="sr-only">View</span>
                                                </Link>

                                                <Link
                                                    to={`/app/devices/${device.id}/edit`}
                                                    aria-label="Edit device"
                                                    title="Edit"
                                                    className="btn-icon btn-icon-edit"
                                                >
                                                    <Pencil className="h-4 w-4" aria-hidden/>
                                                    <span className="sr-only">Edit</span>
                                                </Link>

                                                <RowDeleteButton id={device.id} title="Yakin Ingin Menghapus?"
                                                                 message="Tindakan ini tidak dapat dibatalkan. Yakin ingin melanjutkan?"
                                                                 onRequestDelete={requestDelete}/>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {(data && devices.length > 0) && (
                <Pagination
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={limit}
                    onPageChange={(nextPage) => {
                        navigate({
                            pathname: ".",
                            search: createSearchParams({
                                page: String(nextPage),
                                limit: String(limit),
                                ...(q ? {q} : {}),
                            }).toString(),
                        });
                    }}
                />
            )}
        </div>
    );
}
