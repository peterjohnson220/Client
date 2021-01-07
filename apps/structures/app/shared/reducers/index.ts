import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromSharedReducer from './shared.reducer';


// Feature area state
export interface StructuresSharedState {
  shared: fromSharedReducer.State;

}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_shared: StructuresSharedState;
}

// Feature area reducers
export const reducers = {
  shared: fromSharedReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState =
  createFeatureSelector<StructuresSharedState>('structures_shared');


// Selectors
export const selectSharedState = createSelector(
  selectFeatureAreaState,
  (state: StructuresSharedState) => state.shared
);


// Shared
export const getMetadata = createSelector(
  selectSharedState, fromSharedReducer.getMetadata
);

