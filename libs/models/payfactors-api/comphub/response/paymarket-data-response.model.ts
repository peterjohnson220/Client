import { PayMarket } from '../../../paymarket';

export interface PayMarketDataResponse {
  HasPaymarketRestrictions: boolean;
  AccessiblePayMarkets: PayMarket[];
}
