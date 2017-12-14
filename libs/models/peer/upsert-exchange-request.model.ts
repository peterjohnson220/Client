export interface UpsertExchangeRequest {
  ExchangeId: number;
  ExchangeName: string;
  CompanyIds: number[];
}

export function generateMockUpsertExchangeRequest(): UpsertExchangeRequest {
  return {
    ExchangeId: 0,
    ExchangeName: 'test',
    CompanyIds: []
  };
}
