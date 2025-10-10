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