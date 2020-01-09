import { generateMockExchangeDataSearchResponse, ExchangeDataSearchResponse } from '../../exchange-data-search/response';
import { generateMockGeoCoordinates, GeoCoordinates } from '../../../../peer';
import { generateMockSearchSavedFilterResponse, SearchSavedFilterResponse } from '../../../user-filter/response';

export interface ExchangeExplorerScopeResponseContext {
  ExchangeDataSearchResponse: ExchangeDataSearchResponse;
  SelectedFilterOptions: SearchSavedFilterResponse;
  ClusterPrecision: number;
  ZoomLevel: number;
  ScopeTopLeft: GeoCoordinates;
  ScopeBottomRight: GeoCoordinates;
}

export function generateMockExchangeExplorerScopeResponseContext(): ExchangeExplorerScopeResponseContext {
  return {
    ExchangeDataSearchResponse: generateMockExchangeDataSearchResponse(),
    SelectedFilterOptions: generateMockSearchSavedFilterResponse(),
    ClusterPrecision: 0,
    ScopeBottomRight: generateMockGeoCoordinates(),
    ScopeTopLeft: generateMockGeoCoordinates(),
    ZoomLevel: 0
  };
}
