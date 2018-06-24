import { ExchangeDataSearchFilter } from '../exchange-data-search-filter.model';

export interface BaseDataCutRequest {
  CompanyPayMarketId: number;
  Filter: ExchangeDataSearchFilter;
  ZoomLevel: number;
  PayMarketName: string;
}

export interface AddDataCutRequest extends BaseDataCutRequest {
  CompanyJobId: number;
  UserSessionId: number;
}

export interface UpdateDataCutRequest extends BaseDataCutRequest {
  DataCutGuid: string;
}

