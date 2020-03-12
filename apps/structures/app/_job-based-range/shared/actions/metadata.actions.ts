import { Action } from '@ngrx/store';

export const SET_MODEL_NAME = '[Structures - Job Based Range - Shared] Set Model Name';
export const SET_CURRENCY = '[Structures - Job Based Range - Shared] Set Currency';

export class SetModelName implements Action {
  readonly type = SET_MODEL_NAME;

  constructor(public payload: string) {}
}

export class SetCurrency implements Action {
  readonly type = SET_CURRENCY;

  constructor(public payload: string) {}
}

export type MetadataActions
  = SetModelName
  | SetCurrency;
