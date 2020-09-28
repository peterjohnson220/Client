import { QuickPriceMarketData } from './quick-price-response.model';
import { PayMarket } from '../../../paymarket';

export interface JobPricedHistorySummaryResponse extends QuickPriceMarketData {
  PayMarketDto: PayMarket;
  MinPaymarketMinimumWage: number;
  MaxPaymarketMinimumWage: number;
}
