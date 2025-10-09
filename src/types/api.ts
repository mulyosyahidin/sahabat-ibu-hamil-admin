export type ApiSuccess<T> = {
    success: true;
    message: string;
    data: T;
};

export type ApiError = {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
export function isApiSuccess<T>(r: ApiResponse<T>): r is ApiSuccess<T> {
    return r.success;
}
