import { Device } from "@/features/app/devices";

export interface Chat {
    id: number;
    device_id: number;
    wa_number: string;
    name: string;
    age: number;
    current_stack: string;
    last_active_at: Date;
    created_at: Date;
    updated_at: Date;
}

export interface ChatData {
    chat: Chat,
    device: Device;
    stats: {
        message_count: number;
        message_in_count: number;
        message_out_count: number;
        consultation_count: number;
    }
}

export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO'
}

export interface ChatMessage {
    id: number;
    chat_id: number;
    source: 'SYSTEM' | 'USER' | 'MODEL';
    direction: 'IN' | 'OUT';
    type: MessageType;
    body: string;
    meta: Record<string, any> | null;
    media: Record<string, any> | null;
    created_at: string;
}

export type MessageService = {
    getMessageType: (direction: ChatMessage['direction']) => 'IN' | 'OUT';
    getMessageContent: (m: ChatMessage) => any;
    getMessageMedia: (m: ChatMessage) => any;
};
