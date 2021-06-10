import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromStructuresPageReducer from './structures-page.reducer';

// Feature area state
export interface StructuresMainState {
  structuresPage: fromStructuresPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_main: StructuresMainState;
}

// Feature area reducers
export const reducers = {
  structuresPage: fromStructuresPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<StructuresMainState>('structures_main');

// Feature Selectors
export const selectStructuresPageState = createSelector(selectFeatureAreaState,
  (state: StructuresMainState) => state.structuresPage
);

// Structures Page
export const getDeleteStructureModalOpen = createSelector(selectStructuresPageState, fromStructuresPageReducer.getDeleteStructuresModalOpen);
export const getDeletingStructureStatus = createSelector(selectStructuresPageState, fromStructuresPageReducer.getDeletingStructureStatus);
export const getDeletingStructureErrorStatus = createSelector(selectStructuresPageState, fromStructuresPageReducer.getDeletingStructureErrorStatus);

