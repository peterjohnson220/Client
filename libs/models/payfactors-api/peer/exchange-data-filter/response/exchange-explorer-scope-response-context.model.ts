import { generateMockGeoCoordinates, GeoCoordinates } from 'libs/models/peer';
import { generateMockSearchSavedFilterResponse, SearchSavedFilterResponse } from 'libs/models/payfactors-api/user-filter';

import { generateMockExchangeDataSearchResponse, ExchangeDataSearchResponse } from '../../exchange-data-search';

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
