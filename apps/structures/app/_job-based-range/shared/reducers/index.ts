import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromMetadataReducer from './metadata.reducer';

// Feature area state
export interface JobBasedRangeSharedState {
  metadata: fromMetadataReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_jobBasedRange_shared: JobBasedRangeSharedState;
}

// Feature area reducers
export const reducers = {
  metadata: fromMetadataReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState =
  createFeatureSelector<JobBasedRangeSharedState>('structures_jobBasedRange_shared');


// Selectors
export const selectMetadataState = createSelector(
  selectFeatureAreaState,
  (state: JobBasedRangeSharedState) => state.metadata
);

// Metadata
export const getMetadata = createSelector(
  selectMetadataState, fromMetadataReducer.getMetadata
);
