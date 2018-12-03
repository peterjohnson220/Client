import { Action } from '@ngrx/store';

import { CompanyJob } from 'libs/models/company';

export const LOADING  = '[Jobs/Matches Modal] Loading Company Job';
export const LOADING_SUCCESS  = '[Jobs/Matches Modal] Loading Company Job Success';
export const LOADING_ERROR  = '[Jobs/Matches Modal] Loading Company Job Error';

export class Loading implements Action {
  readonly type = LOADING;

  constructor(public payload: number) { }
}

export class LoadingSuccess implements Action {
  readonly type = LOADING_SUCCESS;

  constructor(public payload: CompanyJob) {}
}

export class LoadingError implements Action {
  readonly type = LOADING_ERROR;
}

export type Actions
  = Loading
  | LoadingSuccess
  | LoadingError;
