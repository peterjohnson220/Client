import {PricingMatchDataSearchContext} from './pricing-match-data-search-context.model';

export interface ProjectSearchContext extends PricingMatchDataSearchContext {
  ProjectId: number;
  RestrictToCountryCode: boolean;
}

export function generateMockProjectSearchContext(): ProjectSearchContext {
  return {
    PaymarketId: 1234,
    CurrencyCode: 'USD',
    ProjectId: 555,
    CountryCode: 'USA',
    RestrictToCountryCode: false,
    Rate: 'Annual'
  };
}
