import {useDocumentTitle} from "@/lib/useDocumentTitle";
import {createSearchParams, Link, useNavigate, useSearchParams} from "react-router";
import { ErrorLoadingState, PageHeader, IndexSkeleton, Pagination } from "@/components/ui";
import {getChatStatusBadge} from "@/utils/ui";
import {Eye} from "lucide-react";
import EmptyDevicesState from "@/features/app/devices/components/EmptyDevicesState";
import {useChatsQuery} from "@/features/app/chats/queries/chats.query";

export default function ChatIndexPage() {
    useDocumentTitle("Chats");

    const [sp] = useSearchParams();
    const navigate = useNavigate();

    const page = Number(sp.get("page") ?? 1);
    const limit = Number(sp.get("limit") ?? 10);
    const q = sp.get("q") ?? undefined;

    const {data, isLoading, error} = useChatsQuery({page, limit, q});

    if (isLoading && !data) return <IndexSkeleton/>;
    if (error) return <ErrorLoadingState/>;

    const chats = data!.items;
    const pagination = data!.pagination;

    return (
        <div className="p-6">
            {/* Header */}
            <PageHeader title="Chats" description="Lihat chat user dan Chat Bot"/>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                {chats.length == 0 && <EmptyDevicesState/>}

                {chats.length > 0 && (
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
                                        No. WhatsApp
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Device
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Current Stack
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Pesan
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Konsultasi
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider dark:text-gray-400">
                                        Tindakan
                                    </th>
                                </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody
                                    className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                                {chats.map((item, index) => (
                                    <tr key={item.chat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {(page - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-600 dark:text-white">
                                                {item.chat.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {item.chat.wa_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {item.device.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getChatStatusBadge(item.chat.current_stack)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                                            {item.stats.message_count}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                                            {item.stats.message_count}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex w-full justify-end space-x-2">
                                                <Link
                                                    to={`/app/chats/${item.chat.id}`}
                                                    aria-label="View chat"
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
            {(data && chats.length > 0) && (
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
