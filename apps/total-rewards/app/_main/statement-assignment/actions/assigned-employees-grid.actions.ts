import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

import { CompanyEmployee } from 'libs/models/company';

export const RESET = '[Total Rewards/Assigned Employees Grid] Reset';

export const LOAD_ASSIGNED_EMPLOYEES = '[Total Rewards/Assigned Employees Grid] Load Assigned Employees';
export const LOAD_ASSIGNED_EMPLOYEES_SUCCESS = '[Total Rewards/Assigned Employees Grid] Load Assigned Employees Success';
export const LOAD_ASSIGNED_EMPLOYEES_ERROR = '[Total Rewards/Assigned Employees Grid] Load Assigned Employees Error';

export const TOGGLE_EMPLOYEE_SELECTION = '[Total Rewards/Assigned Employees Grid] Toggle Employee Selection';
export const OPEN_ACTION_MENU = '[Total Rewards/Assigned Employees Grid] Open Action Menu';
export const CLOSE_ACTION_MENU = '[Total Rewards/Assigned Employees Grid] Close Action Menu';

export const CLEAR_SELECTIONS = '[Total Rewards/Assigned Employees Grid] Clear Selections';

export class Reset implements Action {
  readonly type = RESET;
}

export class LoadAssignedEmployees implements Action {
  readonly type = LOAD_ASSIGNED_EMPLOYEES;
  constructor(public payload?: State) {}
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

export class OpenActionMenu implements Action {
  readonly type = OPEN_ACTION_MENU;

  constructor(public payload: CompanyEmployee) {}
}

export class CloseActionMenu implements Action {
  readonly type = CLOSE_ACTION_MENU;
}

export class ClearSelections implements Action {
  readonly type = CLEAR_SELECTIONS;
}

export type AssignedEmployeesGridActions =
  Reset |
  LoadAssignedEmployees |
  LoadAssignedEmployeesSuccess |
  LoadAssignedEmployeesError |
  ToggleEmployeeSelection |
  OpenActionMenu |
  CloseActionMenu |
  ClearSelections;
