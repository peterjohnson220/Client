import { FeatureCollection, Point } from 'geojson';

import { ExchangeMapSummary } from 'libs/models/peer';

import * as fromPeerMapActions from '../actions/map.actions';

export interface State {
  mapCollection: FeatureCollection<Point>;
  mapSummary: ExchangeMapSummary;
  mapFilter: any;
  mapBounds: number[];
  loading: boolean;
  loadingError: boolean;
  shouldUpdateBounds: boolean;
  isInitialMapLoad: boolean;
  maxZoom: number;
}

// Initial State
export const initialState: State = {
  mapCollection: null,
  mapFilter: {
    TopLeft: null,
    BottomRight: null,
    ClusterPrecision: 8
  },
  mapSummary: null,
  mapBounds: [0, 0, 0, 0],
  loading: false,
  loadingError: false,
  shouldUpdateBounds: true,
  isInitialMapLoad: true,
  maxZoom: 7
};

// Reducer
export function reducer(state = initialState, action: fromPeerMapActions.Actions): State {
  switch (action.type) {
    case fromPeerMapActions.LOADING_PEER_MAP: {
      const mapFilter = {
        ...state.mapFilter
      };
      const mapSummary = {
        ...state.mapSummary
      };
      return {
        ...state,
        mapFilter: mapFilter,
        mapCollection: null,
        mapSummary: mapSummary,
        loading: true,
        loadingError: false
      };
    }
    case fromPeerMapActions.LOADING_PEER_MAP_SUCCESS: {
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
        isInitialMapLoad: false
      };
      if (state.isInitialMapLoad) {
        const tl = mapSummary.TopLeft;
        const br = mapSummary.BottomRight;
        newState.mapBounds = [tl.Lon, br.Lat, br.Lon, tl.Lat];
        newState.mapFilter.TopLeft = tl;
        newState.mapFilter.BottomRight = br;
      }
      return newState;
    }
    case fromPeerMapActions.LOADING_PEER_MAP_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromPeerMapActions.UPDATE_PEER_MAP_FILTER_BOUNDS: {
      const bounds = swapBounds(action.payload.bounds);
      const zoom = action.payload.zoom;
      // const zoomPercentage = zoom / 27;
      // const prec = zoom <= 0 ? 1 : Math.round(zoomPercentage * 12);
      const mapFilter = {
        ...state.mapFilter,
        TopLeft: bounds.TopLeft,
        BottomRight: bounds.BottomRight,
        ClusterPrecision: 8
      };
      return {
        ...state,
        mapFilter: mapFilter,
        maxZoom: 17
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
export const canLoadMap = (state: State) => !state.isInitialMapLoad && !state.loading;
export const showNoData = (state: State) => !state.loading && !state.isInitialMapLoad && state.mapCollection.features.length === 0;

function swapBounds(bounds: any): any {
  const ne = bounds._ne;
  const sw = bounds._sw;
  const swappedBounds = {
    TopLeft: {
      Lat: enforceBoundsLimit(ne.lat),
      Lon: enforceBoundsLimit(sw.lng)
    },
    BottomRight: {
      Lat: enforceBoundsLimit(sw.lat),
      Lon: enforceBoundsLimit(ne.lng)
    }
  };
  return swappedBounds;
}

function enforceBoundsLimit(coordinate: number) {
  return coordinate > 180 ? 180 : coordinate < -180 ? -180 : coordinate;
}
