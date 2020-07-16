import { Action } from '@ngrx/store';

export const RESET_STATE = '[Total Rewards/Statement Assignment Modal] Reset State';
export const OPEN_MODAL = '[Total Rewards/Statement Assignment Modal] Open Modal';
export const CLOSE_MODAL = '[Total Rewards/Statement Assignment Modal] Close Modal';
export const SET_CONTEXT = '[Total Rewards/Statement Assignment Modal] Set Context';
export const ASSIGN_EMPLOYEES = '[Total Rewards / Employee Search] Assign Employees';
export const ASSIGN_EMPLOYEES_SUCCESS = '[Total Rewards / Employee Search] Assign Employees Success';
export const ASSIGN_EMPLOYEES_ERROR = '[Total Rewards / Employee Search] Assign Employees Error';
export const ASSIGN_ALL_EMPLOYEES = '[Total Rewards / Employee Search] Assign All Employees';
export const ASSIGN_ALL_EMPLOYEES_SUCCESS = '[Total Rewards / Employee Search] Assign All Employees Success';
export const ASSIGN_ALL_EMPLOYEES_ERROR = '[Total Rewards / Employee Search] Assign All Employees Error';

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export class OpenModal implements Action {
  readonly type = OPEN_MODAL;
}

export class CloseModal implements Action {
  readonly type = CLOSE_MODAL;
}

export class SetContext implements Action {
  readonly type = SET_CONTEXT;

  constructor(public payload: MessageEvent) {}
}

export class AssignEmployees implements Action {
  readonly type = ASSIGN_EMPLOYEES;
}

export class AssignEmployeesSuccess implements Action {
  readonly type = ASSIGN_EMPLOYEES_SUCCESS;
}

export class AssignEmployeesError implements Action {
  readonly type = ASSIGN_EMPLOYEES_ERROR;
}

export class AssignAllEmployees implements Action {
  readonly type = ASSIGN_ALL_EMPLOYEES;
}

export class AssignAllEmployeesSuccess implements Action {
  readonly type = ASSIGN_ALL_EMPLOYEES_SUCCESS;
}

export class AssignAllEmployeesError implements Action {
  readonly type = ASSIGN_ALL_EMPLOYEES_ERROR;
}

export type StatementAssignmentModalActions =
  ResetState |
  OpenModal |
  CloseModal |
  SetContext |
  AssignEmployees |
  AssignEmployeesSuccess |
  AssignEmployeesError |
  AssignAllEmployees |
  AssignAllEmployeesSuccess |
  AssignAllEmployeesError;
