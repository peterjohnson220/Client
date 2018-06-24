import { generateMockPayMarketLocation, PayMarketLocationModel } from './pay-market-location.model';

export interface SystemFilter {
  ExchangeJobIds: number[];
  PayMarketLocation: PayMarketLocationModel;
  ExchangeId: number;
}

export function generateMockSystemFilter(): SystemFilter {
  return {
    ExchangeJobIds: [1, 2, 4],
    PayMarketLocation: generateMockPayMarketLocation(),
    ExchangeId: 1
  };
}
