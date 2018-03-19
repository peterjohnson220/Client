export interface UpsertExchangeJobMapRequest {
  ExchangeJobToCompanyJobId?: number;
  ExchangeId: number;
  ExchangeJobId: number;
  CompanyJobId: number;
}

export function generateMockUpsertExchangeJobMapRequest(): UpsertExchangeJobMapRequest {
  return {
    ExchangeJobToCompanyJobId: 234,
    ExchangeId: 1,
    ExchangeJobId: 123,
    CompanyJobId: 435
  };
}
