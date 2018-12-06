import { Action } from '@ngrx/store';

export const SUBMIT = '[Registration/Complete Registration] Submit';
export const SUBMIT_SUCCESS = '[Registration/Complete Registration] Submit Success';
export const SUBMIT_ERROR = '[Registration/Complete Registration] Submit Error';

export class Submit implements Action {
  readonly type = SUBMIT;
  constructor(public payload: { token: string, password: string }) {}
}

export class SubmitSuccess implements Action {
  readonly type = SUBMIT_SUCCESS;
  constructor(public payload: { homePagePath: string }) {}
}

export class SubmitError implements Action {
  readonly type = SUBMIT_ERROR;
  constructor(public payload: any) {}
}

export type Actions
  = Submit
  | SubmitSuccess
  | SubmitError;
