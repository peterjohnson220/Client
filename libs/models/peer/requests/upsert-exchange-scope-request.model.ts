import { ExchangeDataSearchFilter, generateMockExchangeDataSearchFilter } from '../exchange-data-search-filter.model';

export interface UpsertExchangeScopeRequest {
  ExchangeScopeGuid: string;
  ExchangeScopeName: string;
  Filter: ExchangeDataSearchFilter;
  ZoomLevel: number;
}

export function generateMockUpsertExchangeScopeRequest(): UpsertExchangeScopeRequest {
  return {
    ExchangeScopeGuid: 'MockExchangeScopeGuid',
    ExchangeScopeName: 'MockExchangeScopeName',
    Filter: generateMockExchangeDataSearchFilter(),
    ZoomLevel: 0
  };
}
