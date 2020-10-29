import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';
import { AsyncStateObj } from 'libs/models/state';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromPageReducer from './statement-view.page.reducer';

// Page Module State
export interface StatementViewState {
  page: fromPageReducer.State;
}

// Extend root state with Page Module State
export interface State extends fromRoot.State {
  totalRewards_statementView: StatementViewState;
}

export const reducers = {
  page: fromPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<StatementViewState>('totalRewards_statementView');

// Feature Selectors
export const selectPageState = createSelector(
  selectFeatureAreaState,
  (state: StatementViewState) => state.page
);

export const selectAsyncStatementObj = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.statement
);

// Page Selectors
export const selectStatement = createSelector(
  selectAsyncStatementObj,
  (state: AsyncStateObj<Statement>) => state.obj
);

export const selectStatementLoading = createSelector(
  selectAsyncStatementObj,
  (state: AsyncStateObj<Statement>) => state.loading
);

export const selectStatementLoadingError = createSelector(
  selectAsyncStatementObj,
  (state: AsyncStateObj<Statement>) => state.loadingError
);


export const getEmployeeRewardsData = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.employeeData
);
