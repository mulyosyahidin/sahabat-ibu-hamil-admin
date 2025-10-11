import {User} from "@/types/user";
import {ApiError, ApiSuccess} from "@/types/api";

export type MeResponse = ApiSuccess<{ user: User }> | ApiError;

export interface LoginData {
    user: User;
    token: string;
}

export type LoginResponse = ApiSuccess<LoginData> | ApiError;
