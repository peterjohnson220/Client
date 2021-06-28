import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StatementHistoryViewModel } from 'libs/features/total-rewards/total-rewards-statement/models/statement-history-list-view-model';

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

  export const getStatementHistoryGridState = createSelector(
    selectPageState, (state: fromPageReducer.State) => state.gridState
    );

  export const getStatementHistoryViewModel = createSelector(
    selectPageState, (state: fromPageReducer.State) => state?.statementHistory?.obj
  );

  // Statement history selectors
  export const getStatementHistoryGridData = createSelector(
    getStatementHistoryViewModel,
    (state: StatementHistoryViewModel) => ({
      data: state?.StatementHistory,
      total: state?.TotalCount
    })
  );

export const getStatementHistoryLoading = createSelector(selectPageState, fromPageReducer.getStatementHistoryLoading);

export const getStatementHistoryLoadingError = createSelector(selectPageState, fromPageReducer.getStatementHistoryLoadingError);

export const getStatementLoadingError = createSelector(selectPageState, fromPageReducer.getStatementLoadingError);
