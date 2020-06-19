import { generateMockPayMarketLocation, PayMarketLocationModel } from './pay-market-location.model';

export interface SystemFilter {
  ExchangeJobIds: number[];
  SimilarExchangeJobIds: number[];
  ExchangeJobId?: number;
  LockedExchangeJobId?: number;
  PayMarketLocation: PayMarketLocationModel;
  ExchangeId: number;
  WeightingType: string;
}

export function generateMockSystemFilter(): SystemFilter {
  return {
    ExchangeJobIds: [1, 2, 4],
    SimilarExchangeJobIds: [1, 2, 4],
    PayMarketLocation: generateMockPayMarketLocation(),
    ExchangeId: 1,
    ExchangeJobId: 1,
    LockedExchangeJobId: 1,
    WeightingType: 'I'
  };
}
