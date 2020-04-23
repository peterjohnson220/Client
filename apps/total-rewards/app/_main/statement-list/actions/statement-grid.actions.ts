import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_STATEMENTS = '[Total Rewards/Statement List/Statement Grid] Load Statements';
export const LOAD_STATEMENTS_SUCCESS = '[Total Rewards/Statements/Statement Grid] Load Statements Success';
export const LOAD_STATEMENTS_ERROR = '[Total Rewards/Statements/Statement Grid] Load Statements Error';
export const UPDATE_SEARCH_TERM = '[Total Rewards/Statements/Statement Grid] Update Search Term';

export const OPEN_ACTION_MENU = '[Total Rewards/Statements] Open Action Menu';
export const CLOSE_ACTION_MENU = '[Total Rewards/Statements] Close Action Menu';

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
  constructor(public payload: string) { }
}

export class CloseActionMenu implements Action {
  readonly type = CLOSE_ACTION_MENU;
}

export type StatementGridActions =
  LoadStatements |
  LoadStatementsSuccess |
  LoadStatementsError |
  UpdateSearchTerm |
  OpenActionMenu |
  CloseActionMenu;
