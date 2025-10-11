import {ActionFunctionArgs} from "react-router";
import {api} from "@/lib/api";
import {AnswerConsultationResponse, consultationQueryKeys} from "@/features/app/consultations";
import {queryClient} from "@/lib/react-query/queryClient";
import type {ApiError} from "@/types/api";

export async function answerConsultationAction({ request, params }: ActionFunctionArgs) {
    const consultationId = params.consultationId;
    if (!consultationId) {
        return new Response(JSON.stringify({ success: false, message: "Consultation ID tidak ditemukan" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const formData = await request.formData();
    const answer = String(formData.get("answer") ?? "").trim();

    const res = await api.put<AnswerConsultationResponse>(`/consultations/${consultationId}/answer`, { answer }, { validateStatus: () => true });

    if (res.status >= 200 && res.status < 300 && (res.data as any)?.success === true) {
        await queryClient.invalidateQueries({ queryKey: consultationQueryKeys.detail(consultationId), exact: true });

        return new Response(JSON.stringify({ success: true, message: res.data.message, data: res.data }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (res.status === 404) {
        await queryClient.invalidateQueries({ queryKey: consultationQueryKeys.detail(consultationId), exact: true });
        await queryClient.invalidateQueries({ queryKey: consultationQueryKeys.all, exact: false });

        return new Response(JSON.stringify({ success: false, message: "Konsultasi tidak ditemukan" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const payload: ApiError =
        res.data && res.data.success === false
            ? res.data
            : { success: false, message: "Gagal meminta koneksi" };

    return new Response(JSON.stringify(payload), {
        status: res.status || 400,
        headers: { "Content-Type": "application/json" },
    });
}