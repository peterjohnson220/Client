import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromPageReducer from './statement-history.page.reducers';


// Page Module State
export interface StatementHistoryState {
  page: fromPageReducer.State;
}


// Extend root state with Page Module State
export interface State extends fromRoot.State {
  totalRewards_statementHistory: StatementHistoryState;
}

export const reducers = {
  page: fromPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<StatementHistoryState>('totalRewards_statementHistory');

// Feature Selectors
export const selectPageState = createSelector(
  selectFeatureAreaState,
  (state: StatementHistoryState) => state.page
);

// Page Selectors
export const getStatement = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.statement?.obj
);
