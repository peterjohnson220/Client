export interface ResultsPagingOptions {
  page: number;
  pageSize: number;
}

export function generateMockResultsPagingOptions(): ResultsPagingOptions {
  return {
    page: 3,
    pageSize: 25
  };
}
