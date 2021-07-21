import { Action } from '@ngrx/store';

import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';

export const LOAD_STATEMENT = '[Total Rewards/Statement History] Load Statement';
export const LOAD_STATEMENT_SUCCESS = '[Total Rewards/Statement History] Load Statement Success';
export const LOAD_STATEMENT_ERROR = '[Total Rewards/Statement History] Load Statement Error';

export class LoadStatement implements Action {
  readonly type = LOAD_STATEMENT;
  constructor(public payload: { statementId: string }) {}
}

export class LoadStatementSuccess implements Action {
  readonly type = LOAD_STATEMENT_SUCCESS;
  constructor(public payload: Statement) {}
}

export class LoadStatementError implements Action {
  readonly type = LOAD_STATEMENT_ERROR;
  constructor(public payload: any) {}
}

export type StatementHistoryPageActions =
  LoadStatement |
  LoadStatementSuccess |
  LoadStatementError;
