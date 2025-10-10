import {ApiError, ApiSuccess} from "@/types/api";

export type DeleteDeviceResponse = ApiSuccess<null> | ApiError;
export type RequestConnectionResponse = ApiSuccess<null> | ApiError;
export type DisconnectDeviceResponse = ApiSuccess<null> | ApiError;