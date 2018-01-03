export interface AddExchangeCompaniesRequest {
  ExchangeId: number;
  CompanyIds: number[];
}

export function generateMockAddExchangeCompaniesRequest(): AddExchangeCompaniesRequest {
  return {
    ExchangeId: 1,
    CompanyIds: [1, 2]
  };
}
