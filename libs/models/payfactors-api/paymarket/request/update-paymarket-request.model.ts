import { PayMarket } from 'libs/models/paymarket';
import { NewlyAddedDefaultScope } from 'libs/features/paymarket-management/models';

export interface UpdatePayMarketRequest {
  DefaultExchangeScopes: string[];
  DefaultScopes: NewlyAddedDefaultScope[];
  DefaultScopeIdsToDelete: number[];
  PayMarket: PayMarket;
}
