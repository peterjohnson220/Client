import { Action } from '@ngrx/store';

import { CompanyEmployee } from 'libs/models/company';

import { Statement } from '../../../shared/models';

export const RESET_STATE = '[Total Rewards/Statement Assignment] Reset State';

export const LOAD_STATEMENT = '[Total Rewards/Statement Assignment] Load Statement';
export const LOAD_STATEMENT_SUCCESS = '[Total Rewards/Statement Assignment] Load Statement Success';
export const LOAD_STATEMENT_ERROR = '[Total Rewards/Statement Assignment] Load Statement Error';

export const OPEN_GENERATE_STATEMENT_MODAL = '[Total Rewards/Statement Assignment] Open Generate Statement Modal';
export const CLOSE_GENERATE_STATEMENT_MODAL = '[Total Rewards/Statement Assignment] Close Generate Statement Modal';

export const GENERATE_STATEMENTS = '[Total Rewards/Statement Assignment] Generate Statements';
export const GENERATE_STATEMENTS_SUCCESS = '[Total Rewards/Statement Assignment] Generate Statements Success';
export const GENERATE_STATEMENTS_ERROR = '[Total Rewards/Statement Assignment] Generate Statements Error';

export const GET_ASSIGNED_EMPLOYEES = '[Total Rewards/Statement Assignment] Get Assigned Employees';
export const GET_ASSIGNED_EMPLOYEES_SUCCESS = '[Total Rewards/Statement Assignment] Get Assigned Employees Success';
export const GET_ASSIGNED_EMPLOYEES_ERROR = '[Total Rewards/Statement Assignment] Get Assigned Employees Error';
export const REPLACE_ASSIGNED_EMPLOYEES = '[Total Rewards/Statement Assignment] Replace Assigned Employees';

export const TOGGLE_SELECTED_EMPLOYEE = '[Total Rewards/Statement Assignment] Toggle Selected Employee';

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export class LoadStatement implements Action {
  readonly type = LOAD_STATEMENT;
  constructor(public payload: { statementId: string }) { }
}

export class LoadStatementSuccess implements Action {
  readonly type = LOAD_STATEMENT_SUCCESS;
  constructor(public payload: Statement) {}
}

export class LoadStatementError implements Action {
  readonly type = LOAD_STATEMENT_ERROR;
  constructor(public payload: any) {}
}

export class OpenGenerateStatementModal implements Action {
  readonly type = OPEN_GENERATE_STATEMENT_MODAL;
}

export class CloseGenerateStatementModal implements Action {
  readonly type = CLOSE_GENERATE_STATEMENT_MODAL;
}

export class GenerateStatements implements Action {
  readonly type = GENERATE_STATEMENTS;
}

export class GenerateStatementsSuccess implements Action {
  readonly type = GENERATE_STATEMENTS_SUCCESS;
}

export class GenerateStatementsError implements Action {
  readonly type = GENERATE_STATEMENTS_ERROR;
  constructor(public payload: any) {}
}

export class ToggleSelectedEmployee implements Action {
  readonly type = TOGGLE_SELECTED_EMPLOYEE;

  constructor(public payload: { CompanyEmployeeId: number }) {}
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
  LoadStatement |
  LoadStatementSuccess |
  LoadStatementError |
  OpenGenerateStatementModal |
  CloseGenerateStatementModal |
  GenerateStatements |
  GenerateStatementsSuccess |
  GenerateStatementsError |
  GetAssignedEmployees |
  GetAssignedEmployeesSuccess |
  GetAssignedEmployeesError |
  ReplaceAssignedEmployees |
  ToggleSelectedEmployee;
