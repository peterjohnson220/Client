import { Action } from '@ngrx/store';
import { RegistrationForm } from 'libs/models';

export const SUBMIT = '[Registration/Registration Form] Submit';
export const SUBMIT_SUCCESS = '[Registration/Registration Form] Submit Success';
export const SUBMIT_ERROR = '[Registration/Registration Form] Submit Error';
export const FIELD_CHANGE = '[Registration/Registration Form] Field Change';
export const CLEAR_FORM = '[Registration/Registration Form] Clear Form';

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

export class FieldChange implements Action {
  readonly type = FIELD_CHANGE;
  constructor(public payload: RegistrationForm) {}
}

export class ClearForm implements Action {
  readonly type = CLEAR_FORM;
  constructor() {}
}

export type Actions
  = FieldChange
  | Submit
  | SubmitSuccess
  | SubmitError
  | ClearForm;
