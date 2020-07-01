// TODO: Unify this and project search context into 1 search context class (ENG-319)
export interface ModifyPricingsSearchContext {
  PricingIds: number[];
  PaymarketId: number;
  CountryCode: string;
  CurrencyCode: string;
  Rate: string;
}

export function generateMockModifyPricingsSearchContextModel(): ModifyPricingsSearchContext {
  return {
    PricingIds: [1],
    PaymarketId: 1,
    CountryCode: 'USA',
    CurrencyCode: 'USD',
    Rate: 'Annual'
  };
}
