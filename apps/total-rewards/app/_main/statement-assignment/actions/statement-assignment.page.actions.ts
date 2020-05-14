import { Action } from '@ngrx/store';

export const RESET_STATE = '[Total Rewards/Statement Assignment] Reset State';
export const SET_STATEMENT_ID = '[Total Rewards/Statement Assignment] Set Statement ID';

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export class SetStatementId implements Action {
  readonly type = SET_STATEMENT_ID;
  constructor(public payload: string) { }
}

export type StatementAssignmentPageActions =
  ResetState |
  SetStatementId;
