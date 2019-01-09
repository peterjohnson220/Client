export interface JobPayMarket {
  CompanyPayMarketId: number;
  PayMarket: string;
  IsSelected: boolean;
  IsHidden: boolean;
}

export function generateMockJobPayMarket(): JobPayMarket {
  return {
    PayMarket: 'New Paymarket',
    CompanyPayMarketId: 1234,
    IsSelected: false,
    IsHidden: false,
  };
}
