export interface ExchangeJobPayMarketFilterRequest {
  CompanyJobId: number;
  CompanyPayMarketId: number;
}

export function generateMockExchangeJobAndPayMarketFilterRequest(): ExchangeJobPayMarketFilterRequest {
  return {
    CompanyJobId: 1,
    CompanyPayMarketId: 1
  };
}
