import { Action } from '@ngrx/store';

import { ListAreaColumnResponse } from 'libs/models/payfactors-api/user-profile/response';

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

export const LOAD_ASSIGNED_EMPLOYEES_LIST_AREA_COLUMNS = '[Total Rewards/Statement Assignment] Load Assigned Employees List Area Columns';
export const LOAD_ASSIGNED_EMPLOYEES_LIST_AREA_COLUMNS_SUCCESS = '[Total Rewards/Statement Assignment] Load Assigned Employees List Area Columns Success';
export const LOAD_ASSIGNED_EMPLOYEES_LIST_AREA_COLUMNS_ERROR = '[Total Rewards/Statement Assignment] Load Assigned Employees List Area Columns Error';

export const TOGGLE_GRID_FILTERS = '[Total Rewards/Statement Assignment] Toggle Grid Filters';

export const OPEN_UNASSIGN_MODAL = '[Total Rewards/Statement Assignment] Open Unassign Modal';
export const CLOSE_UNASSIGN_MODAL = '[Total Rewards/Statement Assignment] Close Unassign Modal';
export const OPEN_SINGLE_EMPLOYEE_UNASSIGN_MODAL = '[Total Rewards/Statement Assignment] Open Single Employee Unassign Modal';

export const UNASSIGN_EMPLOYEES = '[Total Rewards/Statement Assignment] Unassign Employees';
export const UNASSIGN_EMPLOYEES_SUCCESS = '[Total Rewards/Statement Assignment] Unassign Employees Success';
export const UNASSIGN_EMPLOYEES_ERROR = '[Total Rewards/Statement Assignment] Unassign Employees Error';

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
  constructor(public payload: { eventId: string }) {}
}

export class GenerateStatementsError implements Action {
  readonly type = GENERATE_STATEMENTS_ERROR;
  constructor(public payload: any) {}
}

export class LoadAssignedEmployeesListAreaColumns implements Action {
  readonly type = LOAD_ASSIGNED_EMPLOYEES_LIST_AREA_COLUMNS;
}

export class LoadAssignedEmployeesListAreaColumnsSuccess implements Action {
  readonly type = LOAD_ASSIGNED_EMPLOYEES_LIST_AREA_COLUMNS_SUCCESS;
  constructor(public payload: ListAreaColumnResponse[]) {}
}

export class LoadAssignedEmployeesListAreaColumnsError implements Action {
  readonly type = LOAD_ASSIGNED_EMPLOYEES_LIST_AREA_COLUMNS_ERROR;
}

export class ToggleGridFilters implements Action {
  readonly type = TOGGLE_GRID_FILTERS;
}

export class OpenUnassignModal implements Action {
  readonly type = OPEN_UNASSIGN_MODAL;
}

export class CloseUnassignModal implements Action {
  readonly type = CLOSE_UNASSIGN_MODAL;
}

export class OpenSingleEmployeeUnassignModal implements Action {
  readonly type = OPEN_SINGLE_EMPLOYEE_UNASSIGN_MODAL;
}

export class UnassignEmployees implements Action {
  readonly type = UNASSIGN_EMPLOYEES;
}

export class UnassignEmployeesSuccess implements Action {
  readonly type = UNASSIGN_EMPLOYEES_SUCCESS;
}

export class UnassignEmployeesError implements Action {
  readonly type = UNASSIGN_EMPLOYEES_ERROR;
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
  LoadAssignedEmployeesListAreaColumns |
  LoadAssignedEmployeesListAreaColumnsSuccess |
  LoadAssignedEmployeesListAreaColumnsError |
  ToggleGridFilters |
  GenerateStatementsError |
  OpenUnassignModal |
  CloseUnassignModal |
  UnassignEmployees |
  UnassignEmployeesSuccess |
  UnassignEmployeesError |
  OpenSingleEmployeeUnassignModal;
