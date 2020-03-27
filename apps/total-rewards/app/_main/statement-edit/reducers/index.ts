import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPageReducer from './statement-edit.page.reducer';

// Feature area state
export interface StatementEditState {
  page: fromPageReducer.State;
}

// Extend root state with feature area state
export interface State extends  fromRoot.State {
  totalRewards_statementEdit: StatementEditState;
}

// Feature area reducers
export const reducers = {
  page: fromPageReducer.reducer
};

// Select Feature Area
export const selectStatementEditPageState =
  createFeatureSelector<StatementEditState>('totalRewards_statementEdit');

// Feature Selectors
export const selectStatementState = createSelector(
  selectStatementEditPageState,
  (state: StatementEditState) => state.page.statement.obj
);

export const selectStatement = createSelector(
  selectStatementEditPageState,
  (state: StatementEditState) => state.page.statement.obj
);

export const selectStatementLoading = createSelector(
  selectStatementEditPageState,
  (state: StatementEditState) => state.page.statement.loading
);

export const selectStatementLoadingError = createSelector(
  selectStatementEditPageState,
  (state: StatementEditState) => state.page.statement.loadingError
);

export const selectStatementSaving = createSelector(
  selectStatementEditPageState,
  (state: StatementEditState) => state.page.statement.saving
);

export const selectStatementSavingSuccess = createSelector(
  selectStatementEditPageState,
  (state: StatementEditState) => state.page.statement.savingSuccess
);

export const selectStatementSavingError = createSelector(
  selectStatementEditPageState,
  (state: StatementEditState) => state.page.statement.savingError
);


export const selectCloningFromTemplate = createSelector(
  selectStatementEditPageState,
  (state: StatementEditState) => state.page.cloningFromTemplate
);

export const selectCloningFromTemplateError = createSelector(
  selectStatementEditPageState,
  (state: StatementEditState) => state.page.cloningFromTemplateError
);
