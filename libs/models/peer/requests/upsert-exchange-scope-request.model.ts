import { ExchangeDataSearchFilter, generateMockExchangeDataSearchFilter } from '../exchange-data-search-filter.model';
import { BaseExchangeDataSearchRequest } from '../../payfactors-api/peer/exchange-data-search/request';
export interface ExchangeScopeDetails {
  ExchangeId: number;
  ExchangeScopeGuid: string;
  ExchangeScopeName: string;
  ExchangeScopeDescription: string;
  IsDefault?: boolean;
}

export interface UpsertExchangeScopeRequest extends ExchangeScopeDetails {
  Filter: ExchangeDataSearchFilter;
  ZoomLevel: number;
}
export interface UpsertExchangeExplorerScopeRequest {
  ExchangeScopeDetails: ExchangeScopeDetails;
  ExchangeDataSearchRequest: BaseExchangeDataSearchRequest;
}

export function generateMockUpsertExchangeScopeRequest(): UpsertExchangeScopeRequest {
  return {
    ExchangeId: 0,
    ExchangeScopeGuid: 'MockExchangeScopeGuid',
    ExchangeScopeName: 'MockExchangeScopeName',
    ExchangeScopeDescription: 'MockExchangeScopeDescription',
    Filter: generateMockExchangeDataSearchFilter(),
    ZoomLevel: 0
  };
}

