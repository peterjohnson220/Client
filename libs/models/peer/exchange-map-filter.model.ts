export interface ExchangeMapFilter {
  Exchanges: string[];
  States: string[];
  Cities: string[];
  ClusterPrecision: number;
}

export function generateMockExchangeMapFilter(): ExchangeMapFilter {
  return {
    Exchanges: ['ExchangeOne'],
    States: ['StateOne'],
    Cities: ['CityOne, StateOne'],
    ClusterPrecision: 12
  };
}
