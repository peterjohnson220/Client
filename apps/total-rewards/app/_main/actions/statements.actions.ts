import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_STATEMENTS = '[Total Rewards/Statements] Load Statements';
export const LOAD_STATEMENTS_SUCCESS = '[Total Rewards/Statements] Load Statements Success';
export const LOAD_STATEMENTS_ERROR = '[Total Rewards/Statements] Load Statements Error';

export const UPDATE_SEARCH_TERM = '[Total Rewards/Statements] Update Search Term';

export const OPEN_CREATE_NEW_STATEMENT_MODAL = '[Total Rewards/Statements] Open Create New Statement Modal';
export const CLOSE_CREATE_NEW_STATEMENT_MODAL = '[Total Rewards/Statements] Close Create New Statement Modal';

export const OPEN_ACTION_MENU = '[Total Rewards/Statements] Open Action Menu';
export const CLOSE_ACTION_MENU = '[Total Rewards/Statements] Close Action Menu';

// statements
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

export class OpenCreateNewStatementModal implements Action {
  readonly type = OPEN_CREATE_NEW_STATEMENT_MODAL;
}

export class CloseCreateNewStatementModal implements Action {
  readonly type = CLOSE_CREATE_NEW_STATEMENT_MODAL;
}

export class OpenActionMenu implements Action {
  readonly type = OPEN_ACTION_MENU;
  constructor(public payload: number) { }
}

export class CloseActionMenu implements Action {
  readonly type = CLOSE_ACTION_MENU;
}

export type Actions =
  LoadStatements |
  LoadStatementsSuccess |
  LoadStatementsError |
  UpdateSearchTerm |
  OpenCreateNewStatementModal |
  CloseCreateNewStatementModal |
  OpenActionMenu |
  CloseActionMenu;
