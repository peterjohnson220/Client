export interface ExchangeMapFilter {
  States: string[];
  Cities: string[];
}

export function generateMockExchangeMapFilter(): ExchangeMapFilter {
  return {
    States: ['StateOne'],
    Cities: ['CityOne, StateOne']
  };
}
