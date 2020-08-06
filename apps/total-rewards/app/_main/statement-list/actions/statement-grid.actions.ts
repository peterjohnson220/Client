import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { StatementListViewModel } from '../../../shared/models';

export const LOAD_STATEMENTS = '[Total Rewards/Statement List/Statement Grid] Load Statements';
export const LOAD_STATEMENTS_SUCCESS = '[Total Rewards/Statements/Statement Grid] Load Statements Success';
export const LOAD_STATEMENTS_ERROR = '[Total Rewards/Statements/Statement Grid] Load Statements Error';
export const UPDATE_SEARCH_TERM = '[Total Rewards/Statements/Statement Grid] Update Search Term';

export const OPEN_ACTION_MENU = '[Total Rewards/Statements] Open Action Menu';
export const CLOSE_ACTION_MENU = '[Total Rewards/Statements] Close Action Menu';

export const CONFIRM_DELETE_STATEMENT = '[Total Rewards/Statements] Confirm Delete Statement';
export const CLOSE_DELETE_STATEMENT = '[Total Rewards/Statements] Close Delete Statement';
export const DELETE_STATEMENT = '[Total Rewards/Statements] Delete Statement';
export const DELETE_STATEMENT_SUCCESS = '[Total Rewards/Statements] Delete Statement Success';
export const DELETE_STATEMENT_ERROR = '[Total Rewards/Statements] Delete Statement Error';

export class LoadStatements implements Action {
  readonly type = LOAD_STATEMENTS;
}

export class LoadStatementsSuccess implements Action {
  readonly type = LOAD_STATEMENTS_SUCCESS;
  constructor(public payload: GridDataResult) { }
}

export class LoadStatementsError implements Action {
  readonly type = LOAD_STATEMENTS_ERROR;
}

export class UpdateSearchTerm implements Action {
  readonly type = UPDATE_SEARCH_TERM;
  constructor(public payload: string) { }
}

export class OpenActionMenu implements Action {
  readonly type = OPEN_ACTION_MENU;
  constructor(public payload: StatementListViewModel) { }
}

export class CloseActionMenu implements Action {
  readonly type = CLOSE_ACTION_MENU;
}

export class ConfirmDeleteStatement implements Action {
  readonly type = CONFIRM_DELETE_STATEMENT;
  constructor(public payload: StatementListViewModel) {}
}

export class CloseDeleteStatement implements Action {
  readonly type = CLOSE_DELETE_STATEMENT;
}

export class DeleteStatement implements Action {
  readonly type = DELETE_STATEMENT;
}

export class DeleteStatementSuccess implements Action {
  readonly type = DELETE_STATEMENT_SUCCESS;
}

export class DeleteStatementError implements Action {
  readonly type = DELETE_STATEMENT_ERROR;
}

export type StatementGridActions =
  LoadStatements |
  LoadStatementsSuccess |
  LoadStatementsError |
  UpdateSearchTerm |
  OpenActionMenu |
  CloseActionMenu |
  ConfirmDeleteStatement |
  CloseDeleteStatement |
  DeleteStatement |
  DeleteStatementSuccess |
  DeleteStatementError;
