import { FeatureCollection, Point } from 'geojson';

import { ExchangeMapSummary, MapGeoData } from 'libs/models';

import * as fromPeerMapActions from '../actions/map.actions';
import { MapHelper } from '../helpers';

export interface State {
  mapCollection: FeatureCollection<Point>;
  mapSummary: ExchangeMapSummary;
  mapFilter: any;
  loading: boolean;
  loadingError: boolean;
  shouldUpdateBounds: boolean;
  maxZoom: number;
  autoZooming: boolean;

  applyingScope: boolean;

  // Map State
  zoom: number;
  initialZoom: number;
  initialMapCentroid: number[];
  initialMapBounds: number[];
  initialZoomComplete: boolean;
  mapLoaded: boolean;
  initialLoadComplete: boolean;
}

// Initial State
export const initialState: State = {
  mapCollection: null,

  // TODO: This should live and be pulled from the exchange-filter-context reducer
  mapFilter: {},
  mapSummary: null,
  loading: false,
  loadingError: false,
  shouldUpdateBounds: true,
  maxZoom: 7,
  autoZooming: true,
  initialMapBounds: [-180, -65, 100, 85],
  initialZoom: 3,
  initialMapCentroid: [-98, 38.88],
  applyingScope: false,
  initialZoomComplete: false,
  mapLoaded: false,
  initialLoadComplete: false,

  // Map State
  zoom: 0
};

// Reducer
export function reducer(state = initialState, action: fromPeerMapActions.Actions): State {
  switch (action.type) {
    case fromPeerMapActions.LOAD_PEER_MAP_DATA: {
      return {
        ...state,
        mapCollection: null,
        loading: true,
        loadingError: false
      };
    }
    case fromPeerMapActions.LOAD_PEER_MAP_DATA_SUCCESS: {
      const mapSummary: ExchangeMapSummary = action.payload.MapSummary;
      const mapCollection: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: action.payload.FeatureCollection
      };
      const mapFilter = {
        ...state.mapFilter
      };
      const newState = {
        ...state,
        mapCollection: mapCollection,
        mapSummary: mapSummary,
        loading: false,
        loadingError: false,
        initialLoadComplete: true,
        mapFilter: mapFilter
      };

      return newState;
    }
    case fromPeerMapActions.LOAD_PEER_MAP_DATA_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromPeerMapActions.UPDATE_PEER_MAP_FILTER_BOUNDS: {
      return {
        ...state,
        mapFilter: MapHelper.buildMapFilter(state, action.payload),
      };
    }
    case fromPeerMapActions.RESET_STATE: {
      return {
        ...initialState
      };
    }
    case fromPeerMapActions.APPLY_CUT_CRITERIA: {
      const mapDetails = MapHelper.getMapDetailsFromScope(action.payload, true);
      return {
        ...state,
        mapCollection: mapDetails.MapCollection,
        mapSummary: mapDetails.MapSummary,
        applyingScope: true
      };
    }
    case fromPeerMapActions.APPLY_SCOPE_CRITERIA: {
      const mapDetails = MapHelper.getMapDetailsFromScope(action.payload);

      return {
        ...state,
        mapCollection: mapDetails.MapCollection,
        mapSummary: mapDetails.MapSummary,
        initialMapBounds: mapDetails.InitialMapBounds,
        mapFilter: mapDetails.MapFilter,
        applyingScope: true
      };
    }
    case fromPeerMapActions.APPLY_SCOPE_CRITERIA_SUCCESS: {
      return {
        ...state,
        applyingScope: false
      };
    }
    case fromPeerMapActions.CLEAR_MAP_FILTER_BOUNDS: {
      return {
        ...state,
        mapFilter: {
          ...initialState.mapFilter
        },
        maxZoom: initialState.maxZoom,
        autoZooming: true
      };
    }
    case fromPeerMapActions.AUTO_ZOOM_COMPLETE: {
      const newState = {...state};
      if (newState.autoZooming) {
        newState.maxZoom = 17;
        newState.autoZooming = false;
      }
      return newState;
    }
    case fromPeerMapActions.SET_PEER_MAP_BOUNDS: {
      const mapGeoData: MapGeoData = action.payload;
      const mapFilter = {
        ...state.mapFilter
      };
      const newState = {...state, mapFilter};

      MapHelper.setBounds(mapGeoData, state, newState);

      return newState;
    }
    case fromPeerMapActions.MOVE_END: {
      return {
        ...state,
        zoom: action.payload.zoom
      };
    }
    case fromPeerMapActions.INITIAL_ZOOM_COMPLETE: {
      return {
        ...state,
        initialZoomComplete: true
      };
    }
    case fromPeerMapActions.MAP_LOADED: {
      return {
        ...state,
        mapLoaded: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getMapSummary = (state: State) => state.mapSummary;
export const getMapFilter = (state: State) => state.mapFilter;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getMapCollection = (state: State) => state.mapCollection;
export const getInitialMapBounds = (state: State) => state.initialMapBounds;
export const getMaxZoom = (state: State) => state.maxZoom;
export const getInitialZoomLevel = (state: State) => state.initialZoom;
export const getMapCentroid = (state: State) => state.initialMapCentroid;
export const canLoadMap = (state: State) => !state.loading;
export const showNoData = (state: State) => !state.loading && state.initialLoadComplete &&
(!state.mapCollection || state.mapCollection.features.length === 0);
export const hasUntaggedIncumbents = (state: State) => state.mapSummary.OverallMapStats.UntaggedIncumbentCount > 0;
export const getApplyingScope = (state: State) => state.applyingScope;
export const getAutoZooming = (state: State) => state.autoZooming;
export const getZoom = (state: State) => state.zoom;
export const getInitialZoomComplete = (state: State) => state.initialZoomComplete;
export const getMapLoaded = (state: State) => state.mapLoaded;
