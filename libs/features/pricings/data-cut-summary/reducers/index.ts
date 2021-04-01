import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromDataCutSummaryReducer from './data-cut-summary.reducer';

// Feature area state
export interface DataCutSummaryState {
  dataCutSummary: fromDataCutSummaryReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_exchangeDataCuts: DataCutSummaryState;
}

// Feature area reducers
export const reducers = {
  dataCutSummary: fromDataCutSummaryReducer.reducer
};

// Select Feature Area
export const selectDataCutSummaryFeature =
  createFeatureSelector<DataCutSummaryState>('feature_dataCutSummary');

// View Selectors
export const selectDataCutSummaryState =
  createSelector(selectDataCutSummaryFeature, (state: DataCutSummaryState) => state.dataCutSummary);
export const getDataCutSummary = createSelector(selectDataCutSummaryState, fromDataCutSummaryReducer.getDataCutSummary);
export const getDataCutSummaryDictionary = createSelector(selectDataCutSummaryState, fromDataCutSummaryReducer.getDataCutSummaryDictionary);
export const getLoading = createSelector(selectDataCutSummaryState, fromDataCutSummaryReducer.getLoading);
export const getHasError = createSelector(selectDataCutSummaryState, fromDataCutSummaryReducer.getHasError);
