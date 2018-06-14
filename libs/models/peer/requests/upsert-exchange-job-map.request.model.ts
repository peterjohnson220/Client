export interface UpsertExchangeJobMapRequest {
  ExchangeId: number;
  ExchangeJobId: number;
  CompanyJobId: number;
}

export function generateMockUpsertExchangeJobMapRequest(): UpsertExchangeJobMapRequest {
  return {
    ExchangeId: 1,
    ExchangeJobId: 123,
    CompanyJobId: 435
  };
}
