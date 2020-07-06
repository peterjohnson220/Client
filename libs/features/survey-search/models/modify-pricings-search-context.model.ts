import {PricingMatchDataSearchContext} from './pricing-match-data-search-context.model';

export interface ModifyPricingsSearchContext extends PricingMatchDataSearchContext {
  PricingIds: number[];
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
