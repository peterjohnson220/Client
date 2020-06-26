import { PayMarket } from 'libs/models/paymarket';
import { NewlyAddedDefaultScope } from 'libs/features/paymarket-management/models';

export interface AddPayMarketRequest {
  DefaultExchangeScopes: string[];
  DefaultScopes: NewlyAddedDefaultScope[];
  PayMarket: PayMarket;
}
