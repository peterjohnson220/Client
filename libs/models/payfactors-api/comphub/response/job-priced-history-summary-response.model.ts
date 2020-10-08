import { QuickPriceMarketData } from './quick-price-response.model';
import { SearchFilter } from '../../search/response';
import { PayMarket } from '../../../paymarket';
import { ExchangeDataSearchFilterContext } from '../../../peer';
import { SearchFilterMappingDataObj } from '../../../../features/search/models';

export interface JobPricedHistorySummaryResponse extends QuickPriceMarketData {
  PayMarketDto: PayMarket;
  MinPaymarketMinimumWage: number;
  MaxPaymarketMinimumWage: number;
  ExchangeDataSearchFilterContext: ExchangeDataSearchFilterContext;
  Filters: SearchFilter[];
  SearchFilterMappingData: SearchFilterMappingDataObj;
}
