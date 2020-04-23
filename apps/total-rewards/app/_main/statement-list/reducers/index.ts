import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IFeatureGridState } from 'libs/core/reducers/grid.reducer';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPageReducer from './statement-list.page.reducer';
import * as fromGridReducer from 'libs/core/reducers/grid.reducer';
import * as fromStatementGridReducer from './statement-grid.reducer';

// Feature area state
export interface StatementListState {
  page: fromPageReducer.State;
  statements: IFeatureGridState<fromStatementGridReducer.State>;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  totalRewards_statementList: StatementListState;
}

// Feature area reducers
export const reducers = {
  page: fromPageReducer.reducer,
  statements: fromStatementGridReducer.reducer
};

// Select Feature Area
export const selectStatementListPageState = createFeatureSelector<StatementListState>('totalRewards_statementList');

// Feature Selectors

// Page
export const getFocusedTab = createSelector(
  selectStatementListPageState,
  (state: StatementListState) => state.page.FocusedTab
);

// Statements
export const selectStatementsState = createSelector(
  selectStatementListPageState,
  (state: StatementListState) => state.statements
);

export const getStatementsGrid = createSelector(
  selectStatementsState,
  (state: IFeatureGridState<fromStatementGridReducer.State>) => state.grid);

export const getStatementsFeature = createSelector(
  selectStatementsState,
  (state: IFeatureGridState<fromStatementGridReducer.State>) => state.feature);

export const getStatementsLoading = createSelector(getStatementsFeature, fromStatementGridReducer.getStatementsLoading);
export const getStatementsLoadingError = createSelector(getStatementsFeature, fromStatementGridReducer.getStatementsLoadingError);
export const getStatementsSearchTerm = createSelector(getStatementsFeature, fromStatementGridReducer.getSearchTerm);
export const getStatementsGridState = createSelector(getStatementsGrid, fromGridReducer.getGridState);
export const { selectAll: getStatements } = fromStatementGridReducer.adapter.getSelectors(getStatementsFeature);

export const getStatementsOpenActionMenuStatementId = createSelector(getStatementsFeature, fromStatementGridReducer.getOpenActionMenuStatementId);
export const getStatementsTotal = createSelector(getStatementsFeature, fromStatementGridReducer.getStatementsTotal);

export const getStatementsGridData = createSelector(
  getStatements,
  getStatementsTotal,
  (data, total) => ({ data, total })
);
