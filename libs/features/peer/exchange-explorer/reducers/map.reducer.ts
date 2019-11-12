import { FeatureCollection, Point } from 'geojson';

import { ExchangeMapSummary, GenericKeyValue } from 'libs/models';

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
  autoZooming: boolean;
  initialZoom: number;
  initialMapCentroid: number[];
  applyingScope: boolean;
  zoomPrecisionDictionary: GenericKeyValue<number, number>[];
  zoomPrecisionDictionaryLoading: boolean;
  zoomPrecisionDictionaryLoadingError: boolean;
}

// Initial State
export const initialState: State = {
  mapCollection: null,

  // TODO: This should live and be pulled from the exchange-filter-context reducer
  mapFilter: {
    TopLeft: null,
    BottomRight: null,
    ClusterPrecision: 2,
    Centroid: [-98, 38.88]
  },
  mapSummary: null,
  mapBounds: [-180, -65, 100, 85],
  loading: false,
  loadingError: false,
  shouldUpdateBounds: true,
  isInitialLoad: true,
  initialMapMoveComplete: false,
  maxZoom: 7,
  autoZooming: false,
  initialZoom: 3,
  initialMapCentroid: [-98, 38.88],
  applyingScope: false,
  zoomPrecisionDictionary: null,
  zoomPrecisionDictionaryLoading: false,
  zoomPrecisionDictionaryLoadingError: false
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

      MapHelper.setBounds(mapSummary, state, newState);

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
        autoZooming: true
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
        ...initialState,
        zoomPrecisionDictionary: state.zoomPrecisionDictionary
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
        applyingScope: false,
        autoZooming: true
      };
    }
    case fromPeerMapActions.CLEAR_MAP_FILTER_BOUNDS: {
      return {
        ...state,
        mapFilter: {
          ...initialState.mapFilter
        },
        isInitialLoad: true,
        maxZoom: initialState.maxZoom,
        autoZooming: true
      };
    }
    case fromPeerMapActions.LOAD_ZOOM_PRECISION_DICTIONARY: {
      return {
        ...state,
        zoomPrecisionDictionaryLoading: true
      };
    }
    case fromPeerMapActions.LOAD_ZOOM_PRECISION_DICTIONARY_SUCCESS: {
      return {
        ...state,
        zoomPrecisionDictionary: action.payload,
        zoomPrecisionDictionaryLoading: false
      };
    }
    case fromPeerMapActions.LOAD_ZOOM_PRECISION_DICTIONARY_ERROR: {
      return {
        ...state,
        zoomPrecisionDictionaryLoadingError: true,
        zoomPrecisionDictionaryLoading: false
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
    case fromPeerMapActions.LOAD_PEER_MAP_BOUNDS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromPeerMapActions.LOAD_PEER_MAP_BOUNDS_SUCCESS: {
      const mapSummary: ExchangeMapSummary = action.payload.MapSummary;
      const mapFilter = {
        ...state.mapFilter
      };
      const newState = {
        ...state,
        loading: false,
        loadingError: false,
        mapFilter: mapFilter,
        isInitialLoad: false
      };

      MapHelper.setBounds(mapSummary, state, newState);

      if (!MapHelper.MapSummaryHasBounds(mapSummary)) {
         // if we tried to get bounds and have none there is no data, we need to wipe out
         // the previous map items so they no longer show
         const mapCollection: FeatureCollection<Point> = {
          type: 'FeatureCollection',
          features: []
        };

        newState.mapCollection = mapCollection;
        newState.mapFilter = null;

         if (!!newState.mapSummary) {
           newState.mapSummary = mapSummary;
         }
      }
      return newState;
    }
    case fromPeerMapActions.LOAD_PEER_MAP_BOUNDS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
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
export const getAutoZooming = (state: State) => state.autoZooming;
