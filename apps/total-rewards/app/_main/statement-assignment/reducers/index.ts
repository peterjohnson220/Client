import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromPageReducer from './statement-assignment.page.reducer';
import * as fromAssignmentModalReducer from './statement-assignment-modal.reducer';
import * as fromEmployeeSearchResultsReducer from './employee-search-results.reducer';

// Page Module State
export interface StatementAssignmentState {
  page: fromPageReducer.State;
  assignmentsModal: fromAssignmentModalReducer.State;
  employeeSearch: fromEmployeeSearchResultsReducer.State;
}

// Extend root state with Page Module State
export interface State extends fromRoot.State {
  totalRewards_statementAssignments: StatementAssignmentState;
}

export const reducers = {
  page: fromPageReducer.reducer,
  assignmentsModal: fromAssignmentModalReducer.reducer,
  employeeSearch: fromEmployeeSearchResultsReducer.reducer
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

// Page Selectors
export const getStatementId = createSelector(
  selectPageState,
  fromPageReducer.getStatementId
);

export const getAssignedEmployees = createSelector(
  selectPageState,
  fromPageReducer.getAssignedEmployees
);

export const getAssignedEmployeesLoading = createSelector(
  selectPageState,
  fromPageReducer.getAssignedEmployeesLoading
);

export const getAssignedEmployeesLoadingError = createSelector(
  selectPageState,
  fromPageReducer.getAssignedEmployeesLoadingError
);

export const getAssignedEmployeesCount = createSelector(
  selectPageState,
  fromPageReducer.getAssignedEmployeesCount
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

export const getSelectedCompanyEmployeeIds = createSelector(
  selectEmployeeSearchState,
  fromEmployeeSearchResultsReducer.getSelectedCompanyEmployeeIds
);

export const getSelectedEmployeesCount = createSelector(
  selectEmployeeSearchState,
  fromEmployeeSearchResultsReducer.getSelectedEmployeesCount
);
