import {useFetcher, useNavigate, useParams} from "react-router";
import {useConsultationByIdQuery} from "@/features/app/consultations/queries/consulation.query";
import {BackButton, Breadcrumb, ErrorLoadingState, Label, ShowSkeleton, Textarea} from "@/components";
import React, {useCallback, useEffect, useRef} from "react";
import {
    ConsultationData,
    ConsultationStatus,
    ConsultationStatusBadge
} from "@/features/app/consultations";
import Swal from "sweetalert2";

type ActionError = {
    success?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

type ActionSuccess = {
    success: true;
    message: string;
    data: ConsultationData;
};

export default function ConsultationAnswerPage() {
    const {consultationId: consultationIdParam} = useParams();
    const consultationId = consultationIdParam ?? '';

    const {data, isLoading, error} = useConsultationByIdQuery(consultationId);

    const fetcher = useFetcher<ActionError | ActionSuccess>();
    const isSubmitting = fetcher.state === "submitting";
    const fetcherData = fetcher.data;
    const answerRef = useRef<HTMLTextAreaElement  | null>(null);
    const navigate = useNavigate();

    const firstError = useCallback((field: string) =>
        (fetcherData as ActionError | undefined)?.errors?.[field]?.[0] ?? "", [fetcherData]);

    useEffect(() => {
        if (firstError("answer") && answerRef.current) answerRef.current.focus();
    }, [fetcherData, firstError]);

    const didShowRef = useRef(false);

    useEffect(() => {
        const d = fetcherData as ActionSuccess | undefined;

        if (d?.success && !didShowRef.current) {
            didShowRef.current = true;
            void Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: d.message,
                confirmButtonText: "OK",
            });
        }
    }, [fetcherData, navigate, consultationId]);


    if (isLoading) return <ShowSkeleton/>;
    if (error) return <ErrorLoadingState/>;

    const consultation = data!.consultation;
    const chat = data!.chat;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                {/* Breadcrumb aman di HP */}
                <div className="min-w-0 mb-2">
                    <Breadcrumb
                        // scrollOnMobile  // aktifkan kalau path sering panjang
                        className="block truncate text-sm text-gray-500"
                        items={[
                            { label: "App", href: "/app/dashboard" },
                            { label: "Konsultasi", href: "/app/consultations" },
                            { label: `#${consultation.id}`, href: `/app/consultations/${consultation.id}` },
                            { label: "Jawab" },
                        ]}
                    />
                </div>

                {/* Header: kolom di mobile, row mulai ≥sm */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                            Jawab Konsultasi
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-start sm:justify-end">
                        <BackButton to={`/app/consultations/${consultation.id}`} className="shrink-0" />
                    </div>
                </div>
            </div>

            {/* Consultation Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Informasi Konsultasi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nama Pengirim
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                {chat.name}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Umur
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                {chat.age} tahun
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nomor WhatsApp
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                {chat.wa_number}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status
                            </label>
                            <div className="mt-1">
                                <ConsultationStatusBadge status={consultation.status}/>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Pesan Konsultasi
                        </label>
                        <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                                {consultation.message}
                            </p>
                        </div>
                    </div>

                    {consultation.answer && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Jawaban
                            </label>
                            <div
                                className="mt-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                                    {consultation.answer}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Answer Form */}
            {consultation.status != ConsultationStatus.ANSWERED && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <fetcher.Form method="post" className="p-6 space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div
                                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                            {error}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Answer Field */}
                        <div>
                            <Label>
                                Jawaban <span className="text-error-500">*</span>
                            </Label>
                            <Textarea
                                ref={answerRef}
                                name="answer"
                                required
                                autoComplete="answer"
                                placeholder="Masukkan jawaban anda"
                                aria-invalid={!!firstError("answer")}
                                aria-describedby={firstError("answer") ? "answer-error" : undefined}
                            />
                            {firstError("answer") && (
                                <p id="answer-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {firstError("answer")}
                                </p>
                            )}
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Berikan jawaban yang informatif dan membantu untuk pertanyaan konsultasi ini.
                            </p>
                        </div>

                        <div
                            className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
            )}
        </div>
    );
}