import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobSummaryPrintReducer from './job-summary-print.reducer';

// Feature area state
export interface ComphubPrintState {
  jobSummaryPrint: fromJobSummaryPrintReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  comphub_print: ComphubPrintState;
}

// Feature area reducers
export const reducers = {
  jobSummaryPrint: fromJobSummaryPrintReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<ComphubPrintState>('comphub_print');

// Feature Selectors

export const selectJobSummaryPrintState = createSelector(
  selectFeatureAreaState,
  (state: ComphubPrintState) => state.jobSummaryPrint
);

//
export const getJobSummaryPrintDataAsyncObj = createSelector(
  selectJobSummaryPrintState,
  fromJobSummaryPrintReducer.getJobSummaryPrintDataAsyncObj
);

