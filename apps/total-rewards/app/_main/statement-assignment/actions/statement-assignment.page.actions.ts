import { Action } from '@ngrx/store';

import { CompanyEmployee } from 'libs/models/company';

export const RESET_STATE = '[Total Rewards/Statement Assignment] Reset State';
export const SET_STATEMENT_ID = '[Total Rewards/Statement Assignment] Set Statement ID';
export const GET_ASSIGNED_EMPLOYEES = '[Total Rewards/Statement Assignment] Get Assigned Employees';
export const GET_ASSIGNED_EMPLOYEES_SUCCESS = '[Total Rewards/Statement Assignment] Get Assigned Employees Success';
export const GET_ASSIGNED_EMPLOYEES_ERROR = '[Total Rewards/Statement Assignment] Get Assigned Employees Error';
export const REPLACE_ASSIGNED_EMPLOYEES = '[Total Rewards/Statement Assignment] Replace Assigned Employees';

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export class SetStatementId implements Action {
  readonly type = SET_STATEMENT_ID;
  constructor(public payload: string) { }
}

export class GetAssignedEmployees implements Action {
  readonly type = GET_ASSIGNED_EMPLOYEES;
}

export class GetAssignedEmployeesSuccess implements Action {
  readonly type = GET_ASSIGNED_EMPLOYEES_SUCCESS;
}

export class GetAssignedEmployeesError implements Action {
  readonly type = GET_ASSIGNED_EMPLOYEES_ERROR;
}

export class ReplaceAssignedEmployees implements Action {
  readonly type = REPLACE_ASSIGNED_EMPLOYEES;

  constructor(public payload: CompanyEmployee[]) {}
}

export type StatementAssignmentPageActions =
  ResetState |
  SetStatementId |
  GetAssignedEmployees |
  GetAssignedEmployeesSuccess |
  GetAssignedEmployeesError |
  ReplaceAssignedEmployees;
