import { generateMockPayMarketLocation, PayMarketLocationModel } from './pay-market-location.model';

export interface ExchangeJobPayMarketFilter {
  ExchangeJobIds: number[];
  PayMarketLocation: PayMarketLocationModel;
}

export function generateMockExchangeJobPayMarketFilter(): ExchangeJobPayMarketFilter {
  return {
    ExchangeJobIds: [1, 2, 4],
    PayMarketLocation: generateMockPayMarketLocation()
  };
}
