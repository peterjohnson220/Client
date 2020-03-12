import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromEmployeesPageReducer from './employees-page.reducer';

// Feature area state
export interface EmployeesMainState {
  employeesPage: fromEmployeesPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  employees_main: EmployeesMainState;
}

// Feature area reducers
export const reducers = {
  employeesPage: fromEmployeesPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<EmployeesMainState>('employees_main');

// Feature Selectors
export const selectEmployeesPageState = createSelector(
  selectFeatureAreaState,
  (state: EmployeesMainState) => state.employeesPage
);

// Employees Page
export const getPricingJobs = createSelector(
  selectEmployeesPageState,
  fromEmployeesPageReducer.getPricingJobs
);

export const getPricingsJobsError = createSelector(
  selectEmployeesPageState,
  fromEmployeesPageReducer.getPricingsJobsError
);
