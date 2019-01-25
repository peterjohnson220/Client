import { PayMarket } from 'libs/models/paymarket';

export interface AddPayMarketRequest {
  DefaultExchangeScopes: [];
  DefaultScopes: [];
  PayMarket: PayMarket;
}
