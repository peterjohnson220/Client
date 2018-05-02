export interface SystemFilterRequest {
  CompanyJobId: number;
  CompanyPayMarketId: number;
}

export function generateMockExchangeJobAndPayMarketFilterRequest(): SystemFilterRequest {
  return {
    CompanyJobId: 1,
    CompanyPayMarketId: 1
  };
}
