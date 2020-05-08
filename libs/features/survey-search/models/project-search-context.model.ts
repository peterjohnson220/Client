export interface SearchContext {
  PayMarketId: number;
  CurrencyCode: string;
  ProjectId: number;
  CountryCode: string;
  RestrictToCountryCode: boolean;
  Rate?: string;
}

export function generateMockProjectSearchContext(): SearchContext {
  return {
    PayMarketId: 1234,
    CurrencyCode: 'USD',
    ProjectId: 555,
    CountryCode: 'USA',
    RestrictToCountryCode: false
  };
}
