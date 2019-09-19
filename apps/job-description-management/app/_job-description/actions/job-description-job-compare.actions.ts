import { Action } from '@ngrx/store';

import { JobDescription } from 'libs/models/jdm';

export const LOAD_SOURCE_JOB_DESCRIPTION = '[Job Description Management Job Compare] Load Source Job Description';
export const LOAD_SOURCE_JOB_DESCRIPTION_SUCCESS = '[Job Description Management Job Compare] Load Source Job Description Success';
export const LOAD_SOURCE_JOB_DESCRIPTION_ERROR = '[Job Description Management Job Compare] Load Source Job Description Error';
export const LOAD_JOB_DESCRIPTION_LIST = '[Job Description Management Job Compare] Load Job Description List';
export const LOAD_JOB_DESCRIPTION_LIST_SUCCESS = '[Job Description Management Job Compare] Load Job Description List Success';
export const LOAD_JOB_DESCRIPTION_LIST_ERROR = '[Job Description Management Job Compare] Load Job Description List Error';
export const LOAD_JOB_DESCRIPTION_FOR_COMPARISON = '[Job Description Management Job Compare] Load Job Description for Comparison';
export const LOAD_JOB_DESCRIPTION_FOR_COMPARISON_SUCCESS =
  '[Job Description Management Job Compare] Load Job Description for Comparison Success';
export const LOAD_JOB_DESCRIPTION_FOR_COMPARISON_ERROR =
  '[Job Description Management Job Compare] Load Job Description for Comparison Error';

export class LoadSourceJobDescription implements Action {
  readonly type = LOAD_SOURCE_JOB_DESCRIPTION;
  constructor(public payload: number) {}
}

export class LoadSourceJobDescriptionSuccess implements Action {
  readonly type = LOAD_SOURCE_JOB_DESCRIPTION_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadSourceJobDescriptionError implements Action {
  readonly type = LOAD_SOURCE_JOB_DESCRIPTION_ERROR;
  constructor() {}
}

export class LoadJobDescriptionList implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIST;
  constructor(public payload: any) { }
}

export class LoadJobDescriptionListSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIST_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadJobDescriptionListError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIST_ERROR;
  constructor() {}
}

export class LoadJobDescriptionForComparison implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_FOR_COMPARISON;
  constructor(public payload: number) {}
}

export class LoadJobDescriptionForComparisonSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_FOR_COMPARISON_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadJobDescriptionForComparisonError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_FOR_COMPARISON_ERROR;
  constructor() {}
}

export type Actions
  = LoadSourceJobDescription
  | LoadSourceJobDescriptionSuccess
  | LoadSourceJobDescriptionError
  | LoadJobDescriptionList
  | LoadJobDescriptionListSuccess
  | LoadJobDescriptionListError
  | LoadJobDescriptionForComparison
  | LoadJobDescriptionForComparisonSuccess
  | LoadJobDescriptionForComparisonError;
