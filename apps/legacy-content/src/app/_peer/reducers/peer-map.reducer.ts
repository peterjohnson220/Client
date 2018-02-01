import { FeatureCollection, Point } from 'geojson';
import { ExchangeMapFilter, ExchangeMapSummary } from 'libs/models/peer';

import * as fromPeerMapActions from '../actions/peer-map.actions';

export interface State {
  mapCollection: FeatureCollection<Point>;
  mapSummary: ExchangeMapSummary;
  mapFilter: ExchangeMapFilter;
  mapBounds: number[];
  loading: boolean;
  loadingError: boolean;
  boundsChanged: boolean;
}

// Initial State
export const initialState: State = {
  mapCollection: null,
  mapFilter: {
    States: [],
    Cities: []
  },
  mapSummary: null,
  mapBounds: [],
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
      console.log('mapCollection: ', mapCollection);
      console.log('payload: ', action.payload);
      return {
        ...state,
        mapCollection: mapCollection,
        mapSummary: mapSummary,
        loading: false,
        loadingError: false,
        mapBounds: [tl.Lon, br.Lat, br.Lon, tl.Lat],
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
      const mapFilter: ExchangeMapFilter = action.payload;
      return {
        ...state,
        mapFilter: mapFilter,
        boundsChanged: false
      };
    }
    case fromPeerMapActions.UPDATE_PEER_MAP_FILTER_BOUNDS: {
      const bounds = swapBounds(action.payload);
      const mapFilter = {
        ...state.mapFilter,
        TopLeft: bounds.TopLeft,
        BottomRight: bounds.BottomRight
      };
      return {
        ...state,
        mapFilter: mapFilter,
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
export const getMapBounds = (state: State) => state.mapBounds;


function swapBounds(bounds: any): any {
  const ne = bounds._ne;
  const sw = bounds._sw;
  console.log('leftBound: ', sw.lng);
  console.log('rightBound: ', ne.lng);
  console.log('topBound: ', ne.lat);
  console.log('bottomBound: ', sw.lat);
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
