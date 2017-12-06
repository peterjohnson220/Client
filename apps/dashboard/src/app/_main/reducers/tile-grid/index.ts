import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTileGridReducer from './tile-grid.reducer';

// Feature area state
export interface TileGridState {
  tiles: fromTileGridReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  tileGrid: TileGridState;
}

// Feature area reducers
export const reducers = {
  tiles: fromTileGridReducer.reducer
};

// Select Feature Area
export const selectTileGridState = createFeatureSelector<TileGridState>('tileGrid');

// Feature Selectors
export const selectTilesState = createSelector(selectTileGridState, (state: TileGridState) => state.tiles);

// Entity Adapter Selectors
export const {
  selectIds: getTilesIds,
  selectEntities: getTilesDictionary,
  selectAll: getTiles,
  selectTotal: getTilesTotal
} = fromTileGridReducer.adapter.getSelectors(selectTilesState);

export const getTilesLoading = createSelector(selectTilesState, fromTileGridReducer.getLoading);
export const getTilesLoadingError = createSelector(selectTilesState, fromTileGridReducer.getLoadingError);


