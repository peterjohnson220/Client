import { ExchangeDataSearchRequest } from '../exchange-data-cut-filter.model';

export interface AddDataCutRequest {
  CompanyJobId: number;
  CompanyPayMarketId: number;
  UserSessionId: number;
  Filter?: ExchangeDataSearchFilter
}

