import { ExchangeStatCompanyMakeup, generateMockExchangeStatCompanyMakeup } from '../exchange-map-response.model';
import { BaseExchangeDataSearchRequest } from '../../payfactors-api/peer/exchange-data-search/request';

export interface UpsertDataCutRequest {
  DataCutGuid: string;
  CompanyJobId: number | null;
  UserSessionId: number | null;
  CompanyPayMarketId: number;
  IsPayMarketOverride: boolean;
  Filter: BaseExchangeDataSearchRequest;
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
    IsPayMarketOverride: false,
    Filter: {} as BaseExchangeDataSearchRequest,
    ZoomLevel: 1,
    PayMarketName: 'MockPayMarket',
    Companies: [generateMockExchangeStatCompanyMakeup()]
  };
}
