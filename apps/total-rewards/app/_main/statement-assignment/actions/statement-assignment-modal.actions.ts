import { Action } from '@ngrx/store';

export const RESET_STATE = '[Total Rewards/Statement Assignment Modal] Reset State';
export const OPEN_MODAL = '[Total Rewards/Statement Assignment Modal] Open Modal';
export const CLOSE_MODAL = '[Total Rewards/Statement Assignment Modal] Close Modal';
export const SET_CONTEXT = '[Total Rewards/Statement Assignment Modal] Set Context';

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export class OpenModal implements Action {
  readonly type = OPEN_MODAL;
}

export class CloseModal implements Action {
  readonly type = CLOSE_MODAL;
}

export class SetContext implements Action {
  readonly type = SET_CONTEXT;

  constructor(public payload: MessageEvent) {}
}

export type StatementAssignmentModalActions =
  ResetState |
  OpenModal |
  CloseModal |
  SetContext;
