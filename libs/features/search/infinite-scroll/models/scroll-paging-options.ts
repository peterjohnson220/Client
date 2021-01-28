export interface ScrollPagingOptions {
  page: number;
  pageSize: number;
}

export function generateMockScrollPagingOptions(): ScrollPagingOptions {
  return {
    page: 3,
    pageSize: 25
  };
}
