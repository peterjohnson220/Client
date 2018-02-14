export interface InitialMapFilterRequest {
  CompanyJobId: number;
  CompanyPayMarketId: number;
}

export function generateMockInitialMapFilterRequest(): InitialMapFilterRequest {
  return {
    CompanyJobId: 1,
    CompanyPayMarketId: 1
  };
}
