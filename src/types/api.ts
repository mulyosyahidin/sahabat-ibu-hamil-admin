export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export type ApiSuccess<T> = {
    success: true;
    message: string;
    data: T;
    pagination?: PaginationMeta;
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
