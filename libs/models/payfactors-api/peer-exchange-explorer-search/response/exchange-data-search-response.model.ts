import { PagingResponse, SearchFilter, generateMockSearchFilter } from '../../search/response';
import { ExchangeMapResponse, generateMockExchangeMapResponse, GeoCoordinates } from '../../../peer';
import { SearchSavedFilterResponse } from '../../user-filter/response';

export interface ExchangeDataSearchResponse extends ExchangeMapResponse {
  Paging: PagingResponse;
  SearchFilters: SearchFilter[];
  KeepFilteredOutOptions: boolean;
}

export function generateMockExchangeDataSearchResponse(): ExchangeDataSearchResponse {
  return {
    ...generateMockExchangeMapResponse(),
    Paging: {
      TotalRecordCount: 20,
      RecordsReturned: 10
    },
    SearchFilters: [generateMockSearchFilter()],
    KeepFilteredOutOptions: true
  };
}

export interface ExchangeExplorerScopeResponse {
  ExchangeDataSearchResponse: ExchangeDataSearchResponse;
  SelectedFilterOptions: SearchSavedFilterResponse;
  ClusterPrecision: number;
  ZoomLevel: number;
  ScopeTopLeft: GeoCoordinates;
  ScopeBottomRight: GeoCoordinates;
}
