import { Action } from '@ngrx/store';

import { TermsConditionsModel, TermsConditionsSubmissionModel } from 'libs/models';

export const LOADING_TC =  '[Dashboard/TC_Modal] Loading Terms and Conditions';
export const LOADING_TC_SUCCESS =  '[Dashboard/TC_Modal] Loading Terms and Conditions Success';
export const LOADING_TC_ERROR =  '[Dashboard/TC_Modal] Loading Terms and Conditions Error';
export const SUBMITTING_TC = '[Dashboard/TC_Modal] Submitting Terms and Conditions Response';
export const SUBMITTING_TC_SUCCESS = '[Dashboard/TC_Modal] Submitting Terms and Conditions Response Success';
export const SUBMITTING_TC_ERROR = '[Dashboard/TC_Modal] Submitting Terms and Conditions Response Error';

export class LoadingTermsAndConditions implements Action {
  readonly type = LOADING_TC;
  constructor(public payload: string) {}
}

export class LoadingTermsAndConditionsSuccess implements Action {
  readonly type = LOADING_TC_SUCCESS;

  constructor(public payload: TermsConditionsModel) {}
}

export class LoadingTermsAndConditionsError implements Action {
  readonly type = LOADING_TC_ERROR;

  constructor(public any: Error) {}
}

export class SubmittingTermsAndConditionsResponse implements Action {
  readonly type = SUBMITTING_TC;

  constructor(public payload: TermsConditionsSubmissionModel) {}
}

export class SubmittingTermsAndConditionsResponseSuccess implements Action {
  readonly type = SUBMITTING_TC_SUCCESS;

  constructor() {}
}

export class SubmittingTermsAndConditionsResponseError implements Action {
  readonly type = SUBMITTING_TC_ERROR;

  constructor(public payload: TermsConditionsModel) {}
}


export type Actions
  = LoadingTermsAndConditions
  | LoadingTermsAndConditionsSuccess
  | LoadingTermsAndConditionsError
  | SubmittingTermsAndConditionsResponse
  | SubmittingTermsAndConditionsResponseSuccess
  | SubmittingTermsAndConditionsResponseError;
