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

export function getDefaultSystemFilter(): SystemFilter {
  return {
    ExchangeId: null,
    ExchangeJobId: null,
    ExchangeJobIds: null,
    SimilarExchangeJobIds: null,
    LockedExchangeJobId: null,
    PayMarketLocation: null,
    WeightingType: 'I'
  };
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
