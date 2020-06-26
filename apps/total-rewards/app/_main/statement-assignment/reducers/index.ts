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

// Assignments Modal Selectors
export const getIsAssignmentsModalOpen = createSelector(
  selectAssignmentsModalState,
  fromAssignmentModalReducer.getIsOpen
);

// Employee Search Selectors
export const getEmployees = createSelector(
  selectEmployeeSearchState,
  fromEmployeeSearchResultsReducer.getEmployees
);
