import { generateMockGeoCoordinates, GeoCoordinates } from 'libs/models/peer';

import { generateMockSearchSavedFilterResponse, SearchSavedFilterResponse } from '../../../user-filter/response';
import { ExchangeDataSearchResponse, generateMockExchangeDataSearchResponse } from '../../exchange-data-search/response';

export interface ExchangeExplorerScopeResponse {
  ExchangeDataSearchResponse: ExchangeDataSearchResponse;
  SelectedFilterOptions: SearchSavedFilterResponse;
  ClusterPrecision: number;
  ZoomLevel: number;
  ScopeTopLeft: GeoCoordinates;
  ScopeBottomRight: GeoCoordinates;
}

export function generateMockExchangeExplorerScopeResponse(): ExchangeExplorerScopeResponse {
  return {
    ExchangeDataSearchResponse: generateMockExchangeDataSearchResponse(),
    SelectedFilterOptions: generateMockSearchSavedFilterResponse(),
    ClusterPrecision: 0,
    ScopeBottomRight: generateMockGeoCoordinates(),
    ScopeTopLeft: generateMockGeoCoordinates(),
    ZoomLevel: 0
  };
}
