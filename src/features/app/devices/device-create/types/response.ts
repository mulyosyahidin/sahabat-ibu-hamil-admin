import {ApiError, ApiSuccess} from "@/types/api";
import {Device} from "@/features/app/devices/types";

export interface CreateDeviceData {
    device: Device;
}

export type CreateDeviceResponse = ApiSuccess<CreateDeviceData> | ApiError;
