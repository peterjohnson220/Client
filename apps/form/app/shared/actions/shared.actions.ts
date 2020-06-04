import { Action } from '@ngrx/store';

import { FormSubmissionResponse } from 'libs/models/payfactors-api/form';

export const SUBMIT_FORM = '[Form - Shared] Submit Form';
export const SUBMIT_FORM_SUCCESS = '[Form - Shared] Submit Form Success';
export const SUBMIT_FORM_ERROR = '[Form - Shared] Submit Form Error';
export const FORM_UPDATE = '[Form - Shared] Form Update';

export class SubmitForm implements Action {
  readonly type = SUBMIT_FORM;
}

export class SubmitFormSuccess implements Action {
  readonly type = SUBMIT_FORM_SUCCESS;

  constructor(public payload: { formSubmissionResponse: FormSubmissionResponse }) {}
}

export class SubmitFormError implements Action {
  readonly type = SUBMIT_FORM_ERROR;
}

export class FormUpdate implements Action {
  readonly type = FORM_UPDATE;

  constructor(public payload: { rootFormModelValue: any }) {}
}

export type SharedActions
  = SubmitForm
  | SubmitFormSuccess
  | SubmitFormError
  | FormUpdate;
