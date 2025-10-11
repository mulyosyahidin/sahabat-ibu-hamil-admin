import {ApiError, ApiSuccess} from "@/types/api";
import {Consultation} from "@/features/app/consultations";

export interface MarkConsultationAsViewedData {
    data: Consultation;
}

export type MarkConsultationAsViewedResponse = ApiSuccess<MarkConsultationAsViewedData> | ApiError;
export type AnswerConsultationResponse = ApiSuccess<MarkConsultationAsViewedData> | ApiError;