import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';

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
export const selectPageState = createSelector(
  selectStatementEditPageState,
  (state: StatementEditState) => state.page
);

export const selectAsyncStatementObj = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.statement
);

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

export const selectStatementSaving = createSelector(
  selectAsyncStatementObj,
  (state: AsyncStateObj<Statement>) => state.saving
);

export const selectStatementSavingSuccess = createSelector(
  selectAsyncStatementObj,
  (state: AsyncStateObj<Statement>) => state.savingSuccess
);

export const selectStatementSavingError = createSelector(
  selectAsyncStatementObj,
  (state: AsyncStateObj<Statement>) => state.savingError
);

export const selectCloningFromTemplate = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.cloningFromTemplate
);

export const selectCloningFromTemplateError = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.cloningFromTemplateError
);

export const selectIsSettingsPanelOpen = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.isSettingsPanelOpen
);

export const selectIsSettingsSaving = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.settingsSaving
);

export const selectIsSettingsSaveSuccess = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.settingsSaveSuccess
);

export const selectIsSettingsSaveError = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.settingsSaveError
);

export const selectStatementMode = createSelector(
  selectStatementEditPageState,
  (state: StatementEditState) => state.page.mode
);

export const selectAssignedEmployees = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.assignedEmployees
);

export const getEmployeeData = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.employeeData
);
