export interface PagedResponse<T> {
    page?: number;
    pageSize?: number;
    results: T[];
    totalResults: number;
}
