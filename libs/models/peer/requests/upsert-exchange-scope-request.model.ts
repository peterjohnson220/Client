import { ExchangeDataSearchFilter, generateMockExchangeDataSearchFilter } from '../exchange-data-search-filter.model';

export interface UpsertExchangeScopeRequest {
  ExchangeScopeGuid: string;
  ExchangeScopeName: string;
  ExchangeScopeDescription: string;
  Filter: ExchangeDataSearchFilter;
  ZoomLevel: number;
}

export function generateMockUpsertExchangeScopeRequest(): UpsertExchangeScopeRequest {
  return {
    ExchangeScopeGuid: 'MockExchangeScopeGuid',
    ExchangeScopeName: 'MockExchangeScopeName',
    ExchangeScopeDescription: 'MockExchangeScopeDescription',
    Filter: generateMockExchangeDataSearchFilter(),
    ZoomLevel: 0
  };
}
