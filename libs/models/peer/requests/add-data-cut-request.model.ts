import { ExchangeDataSearchFilter } from '../exchange-data-search-filter.model';

export interface AddDataCutRequest {
  CompanyJobId: number;
  CompanyPayMarketId: number;
  UserSessionId: number;
  Filter: ExchangeDataSearchFilter;
  ZoomLevel: number;
  PayMarketName: string;
}

