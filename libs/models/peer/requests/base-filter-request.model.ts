export interface BaseFilterRequest {
  CompanyJobId: number;
  CompanyPayMarketId: number;
}

export function generateMockBaseFilterRequest(): BaseFilterRequest {
  return {
    CompanyJobId: 1,
    CompanyPayMarketId: 1
  };
}
