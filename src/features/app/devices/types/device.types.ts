import {ApiError, ApiSuccess} from "@/types/api";

export enum DeviceStatus {
    Draft = 'DRAFT',
    PendingConnect = 'PENDING_CONNECT',
    Connected = 'CONNECTED',
    Disconnected = 'DISCONNECTED',
    Reconnecting = 'RECONNECTING',
    FailedConnect = 'FAILED_CONNECT',
}

export interface Device {
    id: number;
    name: string;
    code: string;
    status: DeviceStatus;
    phone_number: string | null;
    device_id: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

// Response types
export type DeleteDeviceResponse = ApiSuccess<null> | ApiError;
export type RequestConnectionResponse = ApiSuccess<null> | ApiError;
export type DisconnectDeviceResponse = ApiSuccess<null> | ApiError;

// Create device types
export interface CreateDeviceData {
    device: Device;
}

export type CreateDeviceResponse = ApiSuccess<CreateDeviceData> | ApiError;
