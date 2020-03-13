import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IFeatureGridState } from 'libs/core/reducers/grid.reducer';
import * as fromRoot from 'libs/state/state';
import * as fromGridReducer from 'libs/core/reducers/grid.reducer';

import * as fromPageReducer from './statement-list.page.reducer';

// Feature area state
export interface StatementListState {
  statements: IFeatureGridState<fromPageReducer.State>;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  totalRewards_statementList: StatementListState;
}

// Feature area reducers
export const reducers = {
  statements: fromPageReducer.reducer
};

export const selectStatementListPageState = createFeatureSelector<StatementListState>('totalRewards_statementList');

// Feature Selectors
export const selectStatementsState = createSelector(
  selectStatementListPageState,
  (state: StatementListState) => state.statements
);

export const getStatementsGrid = createSelector(
  selectStatementsState,
  (state: IFeatureGridState<fromPageReducer.State>) => state.grid);

export const getStatementsFeature = createSelector(
  selectStatementsState,
  (state: IFeatureGridState<fromPageReducer.State>) => state.feature);

// Selectors
export const getStatementsLoading = createSelector(getStatementsFeature, fromPageReducer.getStatementsLoading);
export const getStatementsLoadingError = createSelector(getStatementsFeature, fromPageReducer.getStatementsLoadingError);
export const getStatementListSearchTerm = createSelector(getStatementsFeature, fromPageReducer.getSearchTerm);
export const getStatementsGridState = createSelector(getStatementsGrid, fromGridReducer.getGridState);
export const { selectAll: getStatements } = fromPageReducer.adapter.getSelectors(getStatementsFeature);

export const getStatementsOpenActionMenuStatementId = createSelector(getStatementsFeature, fromPageReducer.getOpenActionMenuStatementId);
export const getStatementsTotal = createSelector(getStatementsFeature, fromPageReducer.getStatementsTotal);

export const getStatementsGridData = createSelector(
  getStatements,
  getStatementsTotal,
  (data, total) => ({ data, total })
);
