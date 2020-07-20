import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const RESET = '[Total Rewards/Assigned Employees Grid] Reset';

export const LOAD_ASSIGNED_EMPLOYEES = '[Total Rewards/Assigned Employees Grid] Load Assigned Employees';
export const LOAD_ASSIGNED_EMPLOYEES_SUCCESS = '[Total Rewards/Assigned Employees Grid] Load Assigned Employees Success';
export const LOAD_ASSIGNED_EMPLOYEES_ERROR = '[Total Rewards/Assigned Employees Grid] Load Assigned Employees Error';

export const TOGGLE_EMPLOYEE_SELECTION = '[Total Rewards/Assigned Employees Grid] Toggle Employee Selection';

export class Reset implements Action {
  readonly type = RESET;
}

export class LoadAssignedEmployees implements Action {
  readonly type = LOAD_ASSIGNED_EMPLOYEES;
}

export class LoadAssignedEmployeesSuccess implements Action {
  readonly type = LOAD_ASSIGNED_EMPLOYEES_SUCCESS;
  constructor(public payload: GridDataResult) {}
}

export class LoadAssignedEmployeesError implements Action {
  readonly type = LOAD_ASSIGNED_EMPLOYEES_ERROR;
}

export class ToggleEmployeeSelection implements Action {
  readonly type = TOGGLE_EMPLOYEE_SELECTION;
  constructor(public payload: { CompanyEmployeeId: number }) {}
}

export type AssignedEmployeesGridActions =
  Reset |
  LoadAssignedEmployees |
  LoadAssignedEmployeesSuccess |
  LoadAssignedEmployeesError |
  ToggleEmployeeSelection;
