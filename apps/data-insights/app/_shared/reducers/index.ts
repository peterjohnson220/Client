import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromBaseDataViewModalReducer from './base-data-view-modal.reducer';

// Feature area state
export interface DataInsightsSharedState {
  baseDataViewModal: fromBaseDataViewModalReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  dataInsightsShared_main: DataInsightsSharedState;
}

// Feature area reducers
export const reducers = {
  baseDataViewModal: fromBaseDataViewModalReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataInsightsSharedState>('dataInsightsShared_main');

// Feature Selectors
export const selectBaseDataViewModalState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsSharedState) => state.baseDataViewModal
);

// Base Data View Modal
export const getBaseEntitiesAsync = createSelector(
  selectBaseDataViewModalState,
  fromBaseDataViewModalReducer.getBaseEntitiesAsync
);
