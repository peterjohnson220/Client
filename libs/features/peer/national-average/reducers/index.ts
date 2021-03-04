import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromNationalAverageReducer from './national-average.reducer';

// Feature area state
export interface NationalAverageState {
  nationalAverage: fromNationalAverageReducer.State;
}

export interface State extends fromRoot.State {
  feature_peer_nationalAverage: NationalAverageState;
}

// Feature area reducers
export const reducers = {
  nationalAverage: fromNationalAverageReducer.reducer
};

// Select Feature Area
export const selectNationalAverageFeature =
  createFeatureSelector<NationalAverageState>('feature_peer_nationalAverage');

// View Selectors
export const selectNationalAverageState =
  createSelector(selectNationalAverageFeature, (state: NationalAverageState) => state.nationalAverage);
export const getExchangeJobNationalAverages = createSelector(selectNationalAverageState, fromNationalAverageReducer.getExchangeJobNationalAverages);
