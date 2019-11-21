import { ExchangeDataSearchFilter, generateMockExchangeDataSearchFilter } from '../exchange-data-search-filter.model';
import { ExchangeStatCompanyMakeup, generateMockExchangeStatCompanyMakeup } from '../exchange-map-response.model';

export interface UpsertDataCutRequest<TFilterContext> {
  DataCutGuid: string;
  CompanyJobId: number | null;
  UserSessionId: number | null;
  CompanyPayMarketId: number;
  IsPayMarketOverride: boolean;
  Filter: TFilterContext;
  ZoomLevel: number;
  PayMarketName: string;
  Companies: ExchangeStatCompanyMakeup[];
}

export function generateMockUpsertDataCutRequest(): UpsertDataCutRequest<ExchangeDataSearchFilter> {
  return {
    DataCutGuid: 'MockGUID',
    CompanyJobId: null,
    UserSessionId: null,
    CompanyPayMarketId: 1,
    IsPayMarketOverride: false,
    Filter: generateMockExchangeDataSearchFilter(),
    ZoomLevel: 1,
    PayMarketName: 'MockPayMarket',
    Companies: [generateMockExchangeStatCompanyMakeup()]
  };
}
