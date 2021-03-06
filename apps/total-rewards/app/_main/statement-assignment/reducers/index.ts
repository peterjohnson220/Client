import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';
import { IFeatureGridState } from 'libs/core/reducers/grid.reducer';

import * as fromPageReducer from './statement-assignment.page.reducer';
import * as fromAssignmentModalReducer from './statement-assignment-modal.reducer';
import * as fromEmployeeSearchResultsReducer from './employee-search-results.reducer';
import * as fromAssignedEmployeesGridReducer from './assigned-employees-grid.reducer';
import * as fromGenerateStatementModalReducer from './generate-statement-modal.reducer';

// Page Module State
export interface StatementAssignmentState {
  page: fromPageReducer.State;
  assignmentsModal: fromAssignmentModalReducer.State;
  employeeSearch: fromEmployeeSearchResultsReducer.State;
  assignedEmployees: IFeatureGridState<fromAssignedEmployeesGridReducer.State>;
  generateStatementModal: fromGenerateStatementModalReducer.State;
}

// Extend root state with Page Module State
export interface State extends fromRoot.State {
  totalRewards_statementAssignments: StatementAssignmentState;
}

export const reducers = {
  page: fromPageReducer.reducer,
  assignmentsModal: fromAssignmentModalReducer.reducer,
  employeeSearch: fromEmployeeSearchResultsReducer.reducer,
  assignedEmployees: fromAssignedEmployeesGridReducer.reducer,
  generateStatementModal: fromGenerateStatementModalReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<StatementAssignmentState>('totalRewards_statementAssignment');

// Feature Selectors
export const selectPageState = createSelector(
  selectFeatureAreaState,
  (state: StatementAssignmentState) => state.page
);

export const selectAssignmentsModalState = createSelector(
  selectFeatureAreaState,
  (state: StatementAssignmentState) => state.assignmentsModal
);

export const selectEmployeeSearchState = createSelector(
  selectFeatureAreaState,
  (state: StatementAssignmentState) => state.employeeSearch
);

export const selectAssignedEmployeesState = createSelector(
  selectFeatureAreaState,
  (state: StatementAssignmentState) => state.assignedEmployees
);

export const selectGenerateStatementModalState = createSelector(
  selectFeatureAreaState,
  (state: StatementAssignmentState) => state.generateStatementModal
);

// Page Selectors
export const getStatement = createSelector(
  selectPageState,
  (state: fromPageReducer.State) => state.statement?.obj
);

export const getIsGenerateStatementModalOpen = createSelector(
  selectPageState,
  fromPageReducer.getIsGenerateStatementModalOpen
);

export const getSendingGenerateStatementRequest = createSelector(
  selectPageState,
  fromPageReducer.getSendingGenerateStatementRequest
);

export const getSendingGenerateStatementRequestSuccess = createSelector(
  selectPageState,
  fromPageReducer.getSendingGenerateStatementRequestSuccess
);

export const getSendingGenerateStatementRequestError = createSelector(
  selectPageState,
  fromPageReducer.getSendingGenerateStatementRequestError
);

export const getGridColumns = createSelector(
  selectPageState,
  fromPageReducer.getGridColumns
);

export const getIsFiltersPanelOpen = createSelector(
  selectPageState,
  fromPageReducer.getIsFiltersPanelOpen
);

export const getIsUnassignEmployeesModalOpen = createSelector(
  selectPageState,
  fromPageReducer.getIsUnassignModalOpen
);

export const getIsSingleEmployeeAction = createSelector(
  selectPageState,
  fromPageReducer.getIsSingleEmployeeAction
);

export const getSendingUnassignRequest = createSelector(
  selectPageState,
  fromPageReducer.getUnassignEmployees
);

export const getSendingUnassignRequestSuccess = createSelector(
  selectPageState,
  fromPageReducer.getUnassignEmployeesSuccess
);

export const getSendingUnassignRequestError = createSelector(
  selectPageState,
  fromPageReducer.getUnassignEmployeesError
);

export const getIsExportingAssignedEmployees = createSelector(
  selectPageState,
  fromPageReducer.getIsExporting
);

export const getExportEventAsync = createSelector(
  selectPageState,
  fromPageReducer.getExportEventAsync
);

export const getSavingGridColumns = createSelector(
  selectPageState,
  fromPageReducer.getSavingGridColumns
);

export const getSavingGridColumnsError = createSelector(
  selectPageState,
  fromPageReducer.getSavingGridColumnsError
);

// Assignments Modal Selectors
export const getIsAssignmentsModalOpen = createSelector(
  selectAssignmentsModalState,
  fromAssignmentModalReducer.getIsOpen
);

export const getAssignEmployeesLoading = createSelector(
  selectAssignmentsModalState,
  fromAssignmentModalReducer.getAssignEmployeesLoading
);

export const getAssignEmployeesError = createSelector(
  selectAssignmentsModalState,
  fromAssignmentModalReducer.getAssignEmployeesError
);

export const getAssignAllEmployeesLoading = createSelector(
  selectAssignmentsModalState,
  fromAssignmentModalReducer.getAssignAllEmployeesLoading
);

export const getAssignAllEmployeesError = createSelector(
  selectAssignmentsModalState,
  fromAssignmentModalReducer.getAssignAllEmployeesError
);

// Employee Search Selectors
export const getEmployees = createSelector(
  selectEmployeeSearchState,
  fromEmployeeSearchResultsReducer.getEmployees
);

export const getNoResultsMessage = createSelector(
  selectEmployeeSearchState,
  fromEmployeeSearchResultsReducer.getNoResultsMessage
);

export const getSelectedCompanyEmployeeIds = createSelector(
  selectEmployeeSearchState,
  fromEmployeeSearchResultsReducer.getSelectedCompanyEmployeeIds
);

export const getSelectedEmployeesCount = createSelector(
  selectEmployeeSearchState,
  fromEmployeeSearchResultsReducer.getSelectedEmployeesCount
);

// Assigned Employee Grid Selectors
export const getAssignedEmployeesFeatureState = createSelector(
  selectAssignedEmployeesState,
  (state: IFeatureGridState<fromAssignedEmployeesGridReducer.State>) => state.feature
);

export const getAssignedEmployeesGridState = createSelector(
  selectAssignedEmployeesState,
  (state: IFeatureGridState<fromAssignedEmployeesGridReducer.State>) => state.grid.grid
);

export const getAssignedEmployeesTotal = createSelector(
  getAssignedEmployeesFeatureState,
  fromAssignedEmployeesGridReducer.getAssignedEmployeesTotal
);

export const getAssignedEmployeesGridData = createSelector(
  getAssignedEmployeesFeatureState,
  fromAssignedEmployeesGridReducer.getAssignedEmployeesGridData
);

export const getAssignedEmployeesLoading = createSelector(
  getAssignedEmployeesFeatureState,
  fromAssignedEmployeesGridReducer.getAssignedEmployeesLoading
);

export const getAssignedEmployeesLoadingError = createSelector(
  getAssignedEmployeesFeatureState,
  fromAssignedEmployeesGridReducer.getAssignedEmployeesLoadingError
);

export const getAssignedEmployeesSelectedCompanyEmployeeIds = createSelector(
  getAssignedEmployeesFeatureState,
  fromAssignedEmployeesGridReducer.getSelectedCompanyEmployeeIds
);

export const getAssignedEmployeesSelectedCompanyEmployeeIdCount = createSelector(
  getAssignedEmployeesFeatureState,
  fromAssignedEmployeesGridReducer.getSelectedCompanyEmployeeIdCount
);

export const getAssignedEmployeesTotalOrSelectedCount = createSelector(
  getAssignedEmployeesTotal,
  getAssignedEmployeesSelectedCompanyEmployeeIdCount,
  (total, selected) => selected || total
);

export const getOpenActionMenuEmployee = createSelector(
  getAssignedEmployeesFeatureState,
  fromAssignedEmployeesGridReducer.getOpenActionMenuEmployee
);

export const getSelectAllState = createSelector(
  getAssignedEmployeesFeatureState,
  fromAssignedEmployeesGridReducer.getSelectAllState
);

export const getEmployeeSearchTerm = createSelector(
  getAssignedEmployeesFeatureState,
  fromAssignedEmployeesGridReducer.getEmployeeSearchTerm
);

// Generate Statement Modal
export const getStatementEmailTemplate = createSelector(
  selectGenerateStatementModalState,
  fromGenerateStatementModalReducer.getStatementEmailTemplate
);
