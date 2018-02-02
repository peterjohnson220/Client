export interface ExchangeMapFilter {
  States: string[];
  Cities: string[];
  ClusterPrecision: number;
}

export function generateMockExchangeMapFilter(): ExchangeMapFilter {
  return {
    States: ['StateOne'],
    Cities: ['CityOne, StateOne'],
    ClusterPrecision: 12
  };
}
