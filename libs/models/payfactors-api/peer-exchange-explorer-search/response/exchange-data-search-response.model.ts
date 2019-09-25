import { PagingResponse, SearchFilter, generateMockSearchFilter, SearchFilterOption } from '../../search/response';
import { ExchangeMapResponse, generateMockExchangeMapResponse, GeoCoordinates } from '../../../peer';
import { MultiSelectOption, SearchFilterMappingDataObj } from '../../../../features/search/models';



export interface ExchangeDataSearchResponse extends ExchangeMapResponse {
  Paging: PagingResponse;
  SearchFilters: SearchFilter[];
  SearchFilterMappingDataObj: SearchFilterMappingDataObj;
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
    SearchFilterMappingDataObj: {},
    KeepFilteredOutOptions: true
  };
}

export interface ExchangeExplorerScopeResponse {
  ExchangeDataSearchResponse: ExchangeDataSearchResponse;
  SelectedFilterOptions: MultiSelectOption[];
  ClusterPrecision: number;
  ZoomLevel: number;
  ScopeTopLeft: GeoCoordinates;
  ScopeBottomRight: GeoCoordinates;
}
