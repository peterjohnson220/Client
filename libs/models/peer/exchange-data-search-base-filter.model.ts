import { generateMockPayMarketLocation, PayMarketLocationModel } from './pay-market-location.model';

export interface ExchangeDataSearchBaseFilter {
  ExchangeJobIds: number[];
  PayMarketLocation: PayMarketLocationModel;
}

export function generateMockExchangeDataSearchBaseFilter() {
  return {
    ExchangeJobIds: [1, 2, 4],
    PayMarketLocation: generateMockPayMarketLocation()
  };
}
