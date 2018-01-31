import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeMapFilter, ExchangeMapSummary, MapChunk } from 'libs/models/peer';

import * as fromPeerMapActions from '../actions/peer-map.actions';

// Extended entity state
export interface State extends EntityState<MapChunk> {
  mapSummary: ExchangeMapSummary;
  mapFilter: ExchangeMapFilter;
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<MapChunk> = createEntityAdapter<MapChunk>({
  selectId: (mapChunk: MapChunk) => mapChunk.Id
});

// Initial State
export const initialState: State = adapter.getInitialState({
  mapFilter: {
    States: [],
    Cities: []
  },
  mapSummary: null,
  loading: false,
  loadingError: false
});

// Reducer
export function reducer(state = initialState, action: fromPeerMapActions.Actions): State {
  switch (action.type) {
    case fromPeerMapActions.LOADING_PEER_MAP: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false
      };
    }
    case fromPeerMapActions.LOADING_PEER_MAP_SUCCESS: {
      const incumbents: MapChunk[] = action.payload.MapChunks;
      const mapSummary: ExchangeMapSummary = action.payload.MapSummary;
      return {
        ...adapter.addAll(incumbents, state),
        mapSummary: mapSummary,
        loading: false,
        loadingError: false
      };
    }
    case fromPeerMapActions.LOADING_PEER_MAP_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromPeerMapActions.LOADING_INITIAL_PEER_MAP_FILTER_SUCCESS: {
      const mapFilter: ExchangeMapFilter = action.payload;
      return {
        ...state,
        mapFilter: mapFilter
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
