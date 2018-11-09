import { FeatureCollection, Point } from 'geojson';

import { ExchangeMapSummary } from 'libs/models/peer';

import * as fromPeerMapActions from '../actions/map.actions';
import { MapHelper } from '../helpers';

export interface State {
  mapCollection: FeatureCollection<Point>;
  mapSummary: ExchangeMapSummary;
  mapFilter: any;
  mapBounds: number[];
  loading: boolean;
  loadingError: boolean;
  shouldUpdateBounds: boolean;
  isInitialLoad: boolean;
  initialMapMoveComplete: boolean;
  maxZoom: number;
  initialZoom: number;
  initialMapCentroid: number[];
  applyingScope: boolean;
}

// Initial State
export const initialState: State = {
  mapCollection: null,
  mapFilter: {
    TopLeft: null,
    BottomRight: null,
    ClusterPrecision: 2,
    Centroid: [-98, 38.88]
  },
  mapSummary: null,
  mapBounds: null,
  loading: false,
  loadingError: false,
  shouldUpdateBounds: true,
  isInitialLoad: true,
  initialMapMoveComplete: false,
  maxZoom: 7,
  initialZoom: 3,
  initialMapCentroid: [-98, 38.88],
  applyingScope: false
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
        mapFilter: mapFilter,
        isInitialLoad: false
      };

      const newTL = mapSummary.TopLeft;
      const newBR = mapSummary.BottomRight;
      const hasNewTLBounds = !!newTL && !!newTL.Lat && !!newTL.Lon;
      const hasNewBRBounds = !!newBR && !!newBR.Lat && !!newBR.Lon;
      const shouldSetBounds = hasNewTLBounds && hasNewBRBounds;
      if (state.isInitialLoad && shouldSetBounds) {
        newState.mapBounds = MapHelper.getBoundsForOneMapCopy(newTL, newBR);
        newState.mapFilter.TopLeft = newTL;
        newState.mapFilter.BottomRight = newBR;
      }
      return newState;
    }
    case fromPeerMapActions.LOAD_PEER_MAP_DATA_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromPeerMapActions.INITIAL_MAP_MOVE_COMPLETE: {
      return {
        ...state,
        mapFilter: MapHelper.buildMapFilter(state, action.payload),
        initialMapMoveComplete: true,
        maxZoom: 17
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
        mapBounds: mapDetails.MapBounds,
        initialZoom: mapDetails.ZoomLevel,
        initialMapCentroid: mapDetails.Centroid,
        mapFilter: mapDetails.MapFilter,
        applyingScope: true,
        maxZoom: 17,
        initialMapMoveComplete: true,
        isInitialLoad: false
      };
    }
    case fromPeerMapActions.APPLY_SCOPE_CRITERIA: {
      const mapDetails = MapHelper.getMapDetailsFromScope(action.payload);
      return {
        ...state,
        mapCollection: mapDetails.MapCollection,
        mapSummary: mapDetails.MapSummary,
        mapBounds: mapDetails.MapBounds,
        mapFilter: mapDetails.MapFilter,
        applyingScope: true,
        initialMapMoveComplete: true,
        isInitialLoad: false
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
        isInitialLoad: true
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
export const getMapBounds = (state: State) => state.mapBounds;
export const getMaxZoom = (state: State) => state.maxZoom;
export const getInitialMapMoveComplete = (state: State) => state.initialMapMoveComplete;
export const getInitialZoomLevel = (state: State) => state.initialZoom;
export const getMapCentroid = (state: State) => state.initialMapCentroid;
export const canLoadMap = (state: State) => !state.isInitialLoad && !state.loading;
export const showNoData = (state: State) => !state.loading && !state.isInitialLoad &&
  (!state.mapCollection || state.mapCollection.features.length === 0);
export const getApplyingScope = (state: State) => state.applyingScope;
