import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromPageReducer from './statement-print.page.reducer';

// Page Module State
export interface StatementPrintState {
  page: fromPageReducer.State;
}

// Extend root state with Page Module State
export interface State extends fromRoot.State {
  totalRewards_statementPrint: StatementPrintState;
}

export const reducers = {
  page: fromPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<StatementPrintState>('totalRewards_statementPrint');

// Feature Selectors
export const selectPageState = createSelector(
  selectFeatureAreaState,
  (state: StatementPrintState) => state.page
);

// Page Selectors
export const selectStatement = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.statement?.obj
);
