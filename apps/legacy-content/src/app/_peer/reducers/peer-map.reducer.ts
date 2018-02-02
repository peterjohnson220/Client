import { FeatureCollection, Point } from 'geojson';
import { ExchangeMapFilter, ExchangeMapSummary } from 'libs/models/peer';

import * as fromPeerMapActions from '../actions/peer-map.actions';

export interface MapBounds {
  center: number[];
  bounds: number[];
}

export interface State {
  mapCollection: FeatureCollection<Point>;
  mapSummary: ExchangeMapSummary;
  mapFilter: ExchangeMapFilter;
  mapBounds: MapBounds;
  loading: boolean;
  loadingError: boolean;
  boundsChanged: boolean;
}

// Initial State
export const initialState: State = {
  mapCollection: null,
  mapFilter: {
    States: [],
    Cities: [],
    ClusterPrecision: 1
  },
  mapSummary: null,
  mapBounds: {
    center: [],
    bounds: []
  },
  loading: false,
  loadingError: false,
  boundsChanged: false
}

// Reducer
export function reducer(state = initialState, action: fromPeerMapActions.Actions): State {
  switch (action.type) {
    case fromPeerMapActions.LOADING_PEER_MAP: {
      return {
        ...state,
        mapCollection: null,
        mapSummary: null,
        loading: true,
        loadingError: false,
        boundsChanged: false
      };
    }
    case fromPeerMapActions.LOADING_PEER_MAP_SUCCESS: {
      const mapSummary: ExchangeMapSummary = action.payload.MapSummary;
      const mapCollection: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: action.payload.FeatureCollection
      };
      const tl = mapSummary.TopLeft;
      const br = mapSummary.BottomRight;
      const mapFilter = {
        ...state.mapFilter,
        TopLeft: tl,
        BottomRight: br
      };
      return {
        ...state,
        mapCollection: mapCollection,
        mapSummary: mapSummary,
        loading: false,
        loadingError: false,
        mapFilter: mapFilter,
        mapBounds: {
          center: [mapSummary.Center.Lon, mapSummary.Center.Lat],
          bounds: [tl.Lon, br.Lat, br.Lon, tl.Lat]
        },
        boundsChanged: true
      };
    }
    case fromPeerMapActions.LOADING_PEER_MAP_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true,
        boundsChanged: false
      };
    }
    case fromPeerMapActions.LOADING_INITIAL_PEER_MAP_FILTER_SUCCESS: {
      const mapFilterFromServer: ExchangeMapFilter = action.payload;
      const mapFilter = {
        ...mapFilterFromServer,
        ClusterPrecision: initialState.mapFilter.ClusterPrecision
      };
      return {
        ...state,
        mapFilter: mapFilter,
        boundsChanged: false
      };
    }
    case fromPeerMapActions.UPDATE_PEER_MAP_FILTER_BOUNDS: {
      const bounds = swapBounds(action.payload.bounds);
      const zoom = action.payload.zoom;
      const zoomPercentage = zoom / 20;
      const prec = zoom <= 0 ? 1 : Math.round(zoomPercentage * 12);
      const mapFilter = {
        ...state.mapFilter,
        TopLeft: bounds.TopLeft,
        BottomRight: bounds.BottomRight,
        ClusterPrecision: prec
      };
      return {
        ...state,
        mapFilter: mapFilter,
        boundsChanged: false
      };
    }
    case fromPeerMapActions.SKIP_MAP_QUERY: {
      return {
        ...state,
        boundsChanged: false
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
export const getMapBounds = (state: State) => state.mapBounds.bounds;
export const getMapCenter = (state: State) => state.mapBounds.center;
export const getBoundsChanged = (state: State) => state.boundsChanged;


function swapBounds(bounds: any): any {
  const ne = bounds._ne;
  const sw = bounds._sw;
  const swappedBounds = {
    TopLeft: {
      Lat: ne.lat,
      Lon: sw.lng
    },
    BottomRight: {
      Lat: sw.lat,
      Lon: ne.lng
    }
  };
  return swappedBounds;
}
