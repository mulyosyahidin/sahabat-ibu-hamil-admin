import {useDocumentTitle} from "@/lib/useDocumentTitle";
import {createSearchParams, Link, useNavigate, useSearchParams} from "react-router";
import {ConsultationStatusBadge, useConsultationsQuery} from "@/features/app/consultations";
import {ErrorLoadingState, IndexSkeleton, PageHeader, Pagination} from "@/components";
import {EmptyDevicesState} from "@/features/app/devices";
import {Eye} from "lucide-react";
import {formatDate} from "@/utils/utils";

export default function ConsultationIndexPage() {
    useDocumentTitle("Konsultasi User");

    const [sp] = useSearchParams();
    const navigate = useNavigate();

    const page = Number(sp.get("page") ?? 1);
    const limit = Number(sp.get("limit") ?? 10);
    const q = sp.get("q") ?? undefined;

    const {data, isLoading, error} = useConsultationsQuery({page, limit, q});

    if (isLoading && !data) return <IndexSkeleton/>;
    if (error) return <ErrorLoadingState/>;

    const consultations = data!.items;
    const pagination = data!.pagination;

    return (
        <div className="p-6">
            {/* Header */}
            <PageHeader title="Konsultasi User"
                        description="Lihat dan balas konsultasi yang diajukan user melalui consultation bot"/>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                {consultations.length == 0 && <EmptyDevicesState/>}

                {consultations.length > 0 && (
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
                                        Pesan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Tindakan
                                    </th>
                                </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody
                                    className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                                {consultations.map((item, index) => (
                                    <tr key={item.consultation.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {(page - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {item.chat.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {item.chat.wa_number}
                                            </div>
                                            {item.chat.age && (
                                                <div className="text-xs text-gray-400">
                                                    Usia: {item.chat.age} tahun
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                                                {item.consultation.message || 'Tidak ada pesan'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <ConsultationStatusBadge status={item.consultation.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(item.consultation.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex w-full justify-end space-x-2">
                                                <Link
                                                    to={`/app/consultations/${item.consultation.id}`}
                                                    aria-label="View consultation"
                                                    title="View"
                                                    className="btn-icon btn-icon-view"
                                                >
                                                    <Eye className="h-4 w-4" aria-hidden/>
                                                    <span className="sr-only">View</span>
                                                </Link>
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
            {(data && consultations.length > 0) && (
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