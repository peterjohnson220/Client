import { createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';

import { Tile } from '../models';

import * as fromTileGridActions from '../actions/tile-grid.actions';

export interface State extends EntityState<Tile> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<Tile> = createEntityAdapter<Tile>({
  selectId: (tile: Tile) => tile.Id
});

export const initialState: State = adapter.getInitialState({
 loading: false,
 loadingError: false
});

// Reducer
export function reducer(
  state = initialState,
  action: fromTileGridActions.Actions
): State {
    switch (action.type) {
      case fromTileGridActions.LOADING_TILES: {
        return {
          ...state,
          loading: true,
          loadingError: false
        };
      }
      case fromTileGridActions.LOADING_TILES_SUCCESS: {
        return {
          ...adapter.setAll(action.payload, state),
          loading: false
        };
      }
      case fromTileGridActions.LOADING_TILES_ERROR: {
        return {
            ...state,
            loading: false,
            loadingError: true
          };
      }
      case fromTileGridActions.LOADING_SINGLE_TILE: {
        return {
          ...state,
          loading: true,
          loadingError: false
        };
      }
      case fromTileGridActions.LOADING_SINGLE_TILE_SUCCESS: {

        return {
          ...adapter.updateOne({
            id: action.payload[0].Id,
            changes: action.payload[0],
          }, state),
          loading: false
        };
      }
      case fromTileGridActions.LOADING_SINGLE_TILE_ERROR: {
        return {
          ...state,
          loading: false,
          loadingError: true
        };
      }
      case fromTileGridActions.REORDER_TILES_SUCCESS : {
        return {
          ...adapter.setAll(action.payload, state)
        };
      }
      default: {
        return state;
      }
    }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
