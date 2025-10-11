import {Link, useFetcher, useParams} from "react-router";
import {useConsultationByIdQuery} from "@/features/app/consultations/queries/consulation.query";
import {BackButton, Breadcrumb, ErrorLoadingState, ShowSkeleton} from "@/components";
import React, {useEffect} from "react";
import {formatDate} from "@/utils/utils";
import {ConsultationStatus, ConsultationStatusBadge} from "@/features/app/consultations";

export default function ConsultationShowPage() {
    const { consultationId: consultationIdParam } = useParams();
    const consultationId = consultationIdParam ?? '';

    const markAsViewedFetcher = useFetcher<{ success?: boolean; message?: string }>({
        key: 'mark-consultation-as-viewed',
    });

    const { data, isLoading, error, refetch } = useConsultationByIdQuery(consultationId);
    const status = data?.consultation?.status;

    const didMarkRef = React.useRef<string | null>(null);
    const { state, data: fetcherData, submit } = markAsViewedFetcher;

    useEffect(() => {
        if (
            status === ConsultationStatus.WAITING &&
            didMarkRef.current !== consultationId &&
            state === 'idle' &&
            !fetcherData?.success
        ) {
            didMarkRef.current = consultationId;

            submit(null, {
                method: 'post',
                action: `/app/consultations/${consultationId}/mark-as-viewed`,
            });
        }
    }, [status, consultationId, state, fetcherData?.success, submit]);

    useEffect(() => {
        if (markAsViewedFetcher.data?.success) {
            refetch?.();
        }
    }, [markAsViewedFetcher.data?.success, refetch]);

    if (isLoading) return <ShowSkeleton />;
    if (error) return <ErrorLoadingState />;

    const consultation = data!.consultation;
    const chat = data!.chat;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Breadcrumb
                        items={[
                            {label: "App", href: "/app/dashboard"},
                            {label: "Konsultasi", href: "/app/consultations"},
                            {label: `#${consultation.id}`},
                        ]}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Konsultasi #{consultation.id}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Detail informasi konsultasi dari pengguna
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {consultation.status !== 'ANSWERED' && (
                            <Link
                                to={`/app/consultations/${consultation.id}/answer`}
                                className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Jawab Konsultasi
                            </Link>
                        )}
                        <BackButton to="/app/consultations" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Consultation Message */}
                    <div className="rounded-lg shadow bg-white dark:bg-gray-800">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Pesan Konsultasi
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="prose max-w-none dark:prose-invert">
                                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {consultation.message || 'Tidak ada pesan'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Answer Section */}
                    {consultation.answer && (
                        <div className="rounded-lg shadow bg-white dark:bg-gray-800">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Jawaban Bidan
                                </h2>
                            </div>

                            <div className="p-6">
                                <div className="prose max-w-none dark:prose-invert">
                                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                        {consultation.answer?.trim() || 'Belum ada jawaban'}
                                    </p>
                                </div>

                                {consultation.answered_at && (
                                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                        Dijawab pada: {formatDate(consultation.answered_at)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Information */}
                    <div className="rounded-lg shadow bg-white dark:bg-gray-800">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Status Konsultasi
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status Saat Ini</dt>
                                    <dd className="mt-1">
                                        <ConsultationStatusBadge status={consultation.status} />
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Dibuat</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {formatDate(consultation.created_at)}
                                    </dd>
                                </div>

                                {consultation.viewed_at && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Dilihat</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {formatDate(consultation.viewed_at)}
                                        </dd>
                                    </div>
                                )}

                                {consultation.answered_at && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Dijawab</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {formatDate(consultation.answered_at)}
                                        </dd>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="rounded-lg shadow bg-white dark:bg-gray-800">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Informasi Pengguna
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {chat.name || 'Tidak diketahui'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nomor WhatsApp</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                        {chat.wa_number}
                                    </dd>
                                </div>

                                {chat.age && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Usia</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                            {chat.age} tahun
                                        </dd>
                                    </div>
                                )}

                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Chat</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                        #{consultation.chat_id}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}