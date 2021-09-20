import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromEmployeeSalaryRangeChartReducer from './employee-salary-range-chart.reducer';

export interface EmployeeSalaryRangeChartMainState {
  salaryRangeChart: fromEmployeeSalaryRangeChartReducer.State;
}

export interface State extends fromRoot.State {
  employeeSalaryRangeChart_main: EmployeeSalaryRangeChartMainState;
}

export const reducers = {
  salaryRangeChart: fromEmployeeSalaryRangeChartReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<EmployeeSalaryRangeChartMainState>('employeeSalaryRangeChart_main');

export const selectEmployeeSalaryRangeChartState = createSelector(
  selectFeatureAreaState,
  (state: EmployeeSalaryRangeChartMainState) => state.salaryRangeChart
);

// Salary Range Chart
export const getEmployeeStructures = createSelector(
  selectEmployeeSalaryRangeChartState,
  fromEmployeeSalaryRangeChartReducer.getEmployeeStructures
);
