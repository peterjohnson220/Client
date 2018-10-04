import { ExchangeDataSearchFilter, generateMockExchangeDataSearchFilter } from '../exchange-data-search-filter.model';
import { ExchangeStatCompanyMakeup, generateMockExchangeStatCompanyMakeup } from '../exchange-map-response.model';

export interface UpsertDataCutRequest {
  DataCutGuid: string;
  CompanyJobId: number | null;
  UserSessionId: number | null;
  CompanyPayMarketId: number;
  Filter: ExchangeDataSearchFilter;
  ZoomLevel: number;
  PayMarketName: string;
  Companies: ExchangeStatCompanyMakeup[];
}

export function generateMockUpsertDataCutRequest(): UpsertDataCutRequest {
  return {
    DataCutGuid: 'MockGUID',
    CompanyJobId: null,
    UserSessionId: null,
    CompanyPayMarketId: 1,
    Filter: generateMockExchangeDataSearchFilter(),
    ZoomLevel: 1,
    PayMarketName: 'MockPayMarket',
    Companies: [generateMockExchangeStatCompanyMakeup()]
  };
}
