import { PayMarket } from 'libs/models/paymarket';
import { NewlyAddedDefaultScope } from 'libs/features/paymarkets/paymarket-management/models';

export interface AddPayMarketRequest {
  DefaultExchangeScopes: number[];
  DefaultScopes: NewlyAddedDefaultScope[];
  PayMarket: PayMarket;
}
