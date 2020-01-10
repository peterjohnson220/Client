import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IFeatureGridState } from 'libs/core/reducers/grid.reducer';
import * as fromRoot from 'libs/state/state';
import * as fromGridReducer from 'libs/core/reducers/grid.reducer';

import * as fromStatementsReducer from './statements.reducer';
import * as fromCreateNewStatementReducer from './create-new-statement.reducer';

// Feature area state
export interface TotalRewardsState {
  statements: IFeatureGridState<fromStatementsReducer.State>;
  createNewStatement: fromCreateNewStatementReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  totalRewardsState: TotalRewardsState;
}

// Feature area reducers
export const reducers = {
  statements: fromStatementsReducer.reducer,
  createNewStatement: fromCreateNewStatementReducer.reducer
};

export const selectTotalRewardsState = createFeatureSelector<TotalRewardsState>('totalRewards');

// Feature Selectors
export const selectStatementsState = createSelector(
  selectTotalRewardsState,
  (state: TotalRewardsState) => state.statements
);

export const selectCreateNewStatement = createSelector(
  selectTotalRewardsState,
  (state: TotalRewardsState) => state.createNewStatement
);

export const getStatementsGrid = createSelector(
  selectStatementsState,
  (state: IFeatureGridState<fromStatementsReducer.State>) => state.grid);

export const getTotalRewardsGridState = createSelector(getStatementsGrid, fromGridReducer.getGridState);

// select the non grid related feature state
export const getStatementsFeature = createSelector(
  selectStatementsState,
  (state: IFeatureGridState<fromStatementsReducer.State>) => state.feature);

// statements
export const getStatementsLoading = createSelector(getStatementsFeature, fromStatementsReducer.getStatementsLoading);
export const getStatementsLoadingError = createSelector(getStatementsFeature, fromStatementsReducer.getStatementsLoadingError);
export const getStatementsSearchTerm = createSelector(getStatementsFeature, fromStatementsReducer.getSearchTerm);
export const getStatementsTotal = createSelector(getStatementsFeature, fromStatementsReducer.getStatementsTotal);
export const getStatementsIsCreateNewStatementModalOpen = createSelector(getStatementsFeature, fromStatementsReducer.getIsCreateNewStatementModalOpen);
export const getStatementsOpenActionMenuStatementId = createSelector(getStatementsFeature, fromStatementsReducer.getOpenActionMenuStatementId)

export const getStatementsGridState = createSelector(getStatementsGrid, fromGridReducer.getGridState);
export const { selectAll: getStatements } = fromStatementsReducer.adapter.getSelectors(getStatementsFeature);
export const getStatementsGridData = createSelector(
  getStatements,
  getStatementsTotal,
  (data, total) => ({ data, total })
);

// create new statement (modal)
export const getCreateNewStatementName = createSelector(selectCreateNewStatement, fromCreateNewStatementReducer.getName);
export const getCreateNewStatementTemplateId = createSelector(selectCreateNewStatement, fromCreateNewStatementReducer.getName);
export const getCreateNewStatementIsCreating = createSelector(selectCreateNewStatement, fromCreateNewStatementReducer.getIsCreating);
export const getCreateNewStatementIsCreatingError = createSelector(selectCreateNewStatement, fromCreateNewStatementReducer.getIsCreatingError);

export const getCreateNewStatementIsValidatingName = createSelector(selectCreateNewStatement, fromCreateNewStatementReducer.getIsValidatingName);
export const getCreateNewStatementIsValidName = createSelector(selectCreateNewStatement, fromCreateNewStatementReducer.getIsValidName);
