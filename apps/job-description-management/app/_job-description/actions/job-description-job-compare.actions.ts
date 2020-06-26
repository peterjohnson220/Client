import { Action } from '@ngrx/store';

import { JobDescription } from 'libs/models/jdm';
import { SaveError } from 'libs/models/common/save-error';

import { JobCompareSaveJobDescriptionRequestModel } from '../models/request/';

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
export const LOAD_JOB_DESCRIPTION_COMPARISON_DIFF = '[Job Description Management Job Compare] Load Job Description Comparison Diff';
export const LOAD_JOB_DESCRIPTION_COMPARISON_DIFF_SUCCESS = '[Job Description Management Job Compare] Load Job Description Comparison Diff Success';
export const LOAD_JOB_DESCRIPTION_COMPARISON_DIFF_ERROR = '[Job Description Management Job Compare] Load Job Description Comparison Diff Error';
export const RESET_JOB_DESCRIPTION_JOB_COMPARE_STATE = '[Job Description Management Job Compare] Reset Job Description Job Compare State';
export const SAVE_JOB_DESCRIPTION = '[Job Description Management Job Compare] Save Job Description';
export const SAVE_JOB_DESCRIPTION_SUCCESS = '[Job Description Management Job Compare] Save Job Description Success';
export const SAVE_JOB_DESCRIPTION_ERROR = '[Job Description Management Job Compare] Save Job Description Error';
export const CLEAR_SAVE_JOB_DESCRIPTION_ERROR = '[Job Description Management Job Compare] Clear Save Job Description Error';
export const UPDATE_CONTROL_DATA = '[Job Description Management Job Compare] Update Control Data';
export const REPLACE_CONTROL_DATA = '[Job Description Management Job Compare] Replace Control Data';
export const UPDATE_CONTROL_ADDITIONAL_PROPERTIES = '[Job Description Management Job Compare] Update Control Additional Properties';
export const ADD_DATA_ROW_TO_CONTROL = '[Job Description Management Job Compare] Add Data Row to Control';
export const REMOVE_CONTROL_DATA_ROW = '[Job Description Management Job Compare] Remove Control Data Row';

export class LoadSourceJobDescription implements Action {
  readonly type = LOAD_SOURCE_JOB_DESCRIPTION;

  constructor(public payload: number) {
  }
}

export class LoadSourceJobDescriptionSuccess implements Action {
  readonly type = LOAD_SOURCE_JOB_DESCRIPTION_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadSourceJobDescriptionError implements Action {
  readonly type = LOAD_SOURCE_JOB_DESCRIPTION_ERROR;
}

export class LoadJobDescriptionList implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIST;

  constructor(public payload: any) {
  }
}

export class LoadJobDescriptionListSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIST_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadJobDescriptionListError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIST_ERROR;
}

export class LoadJobDescriptionForComparison implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_FOR_COMPARISON;

  constructor(public payload: number) {
  }
}

export class LoadJobDescriptionForComparisonSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_FOR_COMPARISON_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadJobDescriptionForComparisonError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_FOR_COMPARISON_ERROR;
}

export class LoadJobDescriptionComparisonDiff implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_COMPARISON_DIFF;

  constructor(public sourceJobDescriptionId: number, public compareJobDescriptionId: number) {
  }
}

export class LoadJobDescriptionComparisonDiffSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_COMPARISON_DIFF_SUCCESS;

  constructor(public payload: number) {
  }
}

export class LoadJobDescriptionComparisonDiffError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_COMPARISON_DIFF_ERROR;
}

export class ResetJobDescriptionJobCompareState implements Action {
  readonly type = RESET_JOB_DESCRIPTION_JOB_COMPARE_STATE;
}

export class SaveJobDescription implements Action {
  readonly type = SAVE_JOB_DESCRIPTION;

  constructor(public payload: JobCompareSaveJobDescriptionRequestModel) {
  }
}

export class SaveJobDescriptionSuccess implements Action {
  readonly type = SAVE_JOB_DESCRIPTION_SUCCESS;

  constructor(public payload: JobDescription, public IsFirstSave: boolean) {
  }
}

export class SaveJobDescriptionError implements Action {
  readonly type = SAVE_JOB_DESCRIPTION_ERROR;

  constructor(public payload: SaveError) {
  }
}

export class ClearSaveJobDescriptionError implements Action {
  readonly type = CLEAR_SAVE_JOB_DESCRIPTION_ERROR;
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
  | LoadJobDescriptionForComparisonError
  | LoadJobDescriptionComparisonDiff
  | LoadJobDescriptionComparisonDiffSuccess
  | LoadJobDescriptionComparisonDiffError
  | ResetJobDescriptionJobCompareState
  | SaveJobDescription
  | SaveJobDescriptionSuccess
  | SaveJobDescriptionError
  | ClearSaveJobDescriptionError;
