import { Action } from '@ngrx/store';
import {Statement} from '../../../shared/models';

export const LOAD_STATEMENT = '[Total Rewards/Edit Statement] Load Statement';
export const LOAD_STATEMENT_SUCCESS = '[Total Rewards/Edit Statement] Load Statement Success';
export const LOAD_STATEMENT_ERROR = '[Total Rewards/Edit Statement] Load Statement Error';
export const SAVE_STATEMENT = '[Total Rewards/Edit Statement] Save Statement';
export const SAVE_STATEMENT_SUCCESS = '[Total Rewards/Edit Statement] Save Statement Success';
export const SAVE_STATEMENT_ERROR = '[Total Rewards/Edit Statement] Save Statement Error';

export class LoadStatement implements Action {
  readonly type = LOAD_STATEMENT;
  constructor(public payload: number) {}
}

export class LoadStatementSuccess implements Action {
  readonly type = LOAD_STATEMENT_SUCCESS;
  constructor(public payload: Statement) {}
}

export class LoadStatementError implements Action {
  readonly type = LOAD_STATEMENT_ERROR;
  constructor(public payload: any) {}
}

export class SaveStatement implements Action {
  readonly type = SAVE_STATEMENT;
}

export class SaveStatementSuccess implements Action {
  readonly type = SAVE_STATEMENT_SUCCESS;
}

export class SaveStatementError implements Action {
  readonly type = SAVE_STATEMENT_ERROR;
  constructor(public payload: any) {}
}

export type Actions =
  LoadStatement |
  LoadStatementSuccess |
  LoadStatementError |
  SaveStatement |
  SaveStatementSuccess |
  SaveStatementError;
