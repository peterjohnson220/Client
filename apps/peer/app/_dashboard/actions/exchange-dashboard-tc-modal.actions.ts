import { Action } from '@ngrx/store';

import { TermsConditionsModel, TermsConditionsSubmissionModel } from 'libs/models';

export const LOAD_TC =  '[Peer Dashboard/TC Modal] Load Terms and Conditions';
export const LOAD_TC_SUCCESS =  '[Peer Dashboard/TC Modal] Load Terms and Conditions Success';
export const LOAD_TC_ERROR =  '[Peer Dashboard/TC Modal] Load Terms and Conditions Error';
export const SUBMIT_TC = '[Peer Dashboard/TC Modal] Submit Terms and Conditions Response';
export const SUBMIT_TC_SUCCESS = '[Peer Dashboard/TC Modal] Submit Terms and Conditions Response Success';
export const SUBMIT_TC_ERROR = '[Peer Dashboard/TC Modal] Submit Terms and Conditions Response Error';

export class LoadTermsAndConditions implements Action {
  readonly type = LOAD_TC;
  constructor(public payload: string) {}
}

export class LoadTermsAndConditionsSuccess implements Action {
  readonly type = LOAD_TC_SUCCESS;

  constructor(public payload: TermsConditionsModel) {}
}

export class LoadTermsAndConditionsError implements Action {
  readonly type = LOAD_TC_ERROR;

  constructor(public any: Error) {}
}

export class SubmitTermsAndConditionsResponse implements Action {
  readonly type = SUBMIT_TC;

  constructor(public payload: TermsConditionsSubmissionModel) {}
}

export class SubmitTermsAndConditionsResponseSuccess implements Action {
  readonly type = SUBMIT_TC_SUCCESS;

  constructor() {}
}

export class SubmitTermsAndConditionsResponseError implements Action {
  readonly type = SUBMIT_TC_ERROR;

  constructor(public payload: TermsConditionsModel) {}
}


export type Actions
  = LoadTermsAndConditions
  | LoadTermsAndConditionsSuccess
  | LoadTermsAndConditionsError
  | SubmitTermsAndConditionsResponse
  | SubmitTermsAndConditionsResponseSuccess
  | SubmitTermsAndConditionsResponseError;
