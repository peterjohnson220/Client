import { Action } from '@ngrx/store';

export const SET_CONTEXT = '[Project Add Jobs/Add Jobs Page] Set Context';

export class SetContext implements Action {
  readonly type = SET_CONTEXT;

  constructor(public payload: { PayMarketId: number, ProjectId: number}) {}
}

export type Actions
  = SetContext;
