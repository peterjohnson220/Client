import { Action } from '@ngrx/store';
import { SelfRegistrationForm } from 'libs/models/user/self-registration-form.model';

export const FIELD_CHANGE = '[Request Access/Self Reg] Field Change';
export const SUBMIT = '[Request Access/Self Reg] Submit';
export const SUBMIT_SUCCESS = '[Request Access/Self Reg] Submit Success';
export const SUBMIT_ERROR = '[Request Access/Self Reg] Submit Error';

export class FieldChange implements Action {
  readonly type = FIELD_CHANGE;
  constructor(public payload: SelfRegistrationForm) {}
}

export class Submit implements Action {
  readonly type = SUBMIT;
  constructor() {}
}

export class SubmitSuccess implements Action {
  readonly type = SUBMIT_SUCCESS;
  constructor() {}
}

export class SubmitError implements Action {
  readonly type = SUBMIT_ERROR;
  constructor(public payload: any) {}
}

export type Actions = FieldChange | Submit | SubmitSuccess | SubmitError;
