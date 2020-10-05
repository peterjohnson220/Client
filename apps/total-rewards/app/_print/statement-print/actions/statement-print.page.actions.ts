import { Action } from '@ngrx/store';

import { StatementForPrint } from 'libs/features/total-rewards/total-rewards-statement/models';

export const LOAD_STATEMENT = '[Total Rewards/Statement Print] Load Statement';
export const LOAD_STATEMENT_SUCCESS = '[Total Rewards/Statement Print] Load Statement Success';
export const LOAD_STATEMENT_ERROR = '[Total Rewards/Statement Print] Load Statement Error';

export class LoadStatement implements Action {
  readonly type = LOAD_STATEMENT;
  constructor(public payload: string) { }
}

export class LoadStatementSuccess implements Action {
  readonly type = LOAD_STATEMENT_SUCCESS;
  constructor(public payload: StatementForPrint) { }
}

export class LoadStatementError implements Action {
  readonly type = LOAD_STATEMENT_ERROR;
}

export type StatementPrintPageActions =
  LoadStatement |
  LoadStatementSuccess |
  LoadStatementError;
