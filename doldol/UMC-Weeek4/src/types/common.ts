export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
};

export type CursorBasedResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
};

export const PAGINATION_ORDER = {
    asc: "asc",
    desc: "desc",
} as const;

export type PAGINATION_ORDER = typeof PAGINATION_ORDER[keyof typeof PAGINATION_ORDER];

export type PaginationDto = {
    cursor?: number;
    limit?: number;
    search?: string;
    order?: PAGINATION_ORDER;
};