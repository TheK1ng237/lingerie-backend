
export interface ApiResponseDto<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: Array<{field: string; message: string }>;
}

export type DataResponse<T> = {
    data: T;
}