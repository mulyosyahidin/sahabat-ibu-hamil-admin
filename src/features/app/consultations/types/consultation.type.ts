export enum ConsultationStatus {
    WAITING = "WAITING",
    VIEWED = "VIEWED",
    ANSWERED = "ANSWERED",
}

export interface Consultation {
    id: number;
    chat_id: number;
    message: string;
    answer: string | null;
    status: ConsultationStatus;
    viewed_at: Date;
    answered_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export interface ConsultationData {
    consultation: Consultation;
    chat: {
        name: string;
        age: number;
        wa_number: string;
    };
}