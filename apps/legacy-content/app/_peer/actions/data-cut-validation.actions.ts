import { Action } from '@ngrx/store';

import { DataCutValidationInfo } from 'libs/models/peer/';

export const LOAD_DATA_CUT_VALIDATION = '[Legacy Content/Data Cut Validation] Load Data Cut Validation';
export const LOAD_DATA_CUT_VALIDATION_SUCCESS = '[Legacy Content/Data Cut Validation] Load Data Cut Validation Success';
export const LOAD_DATA_CUT_VALIDATION_ERROR = '[Legacy Content/Data Cut Validation] Load Data Cut Validation Error';

export class LoadDataCutValidation implements Action {
  readonly type = LOAD_DATA_CUT_VALIDATION;

  constructor(public payload: any) {}
}

export class LoadDataCutValidationSuccess implements Action {
  readonly type = LOAD_DATA_CUT_VALIDATION_SUCCESS;

  constructor(public payload: DataCutValidationInfo[]) {}
}

export class LoadDataCutValidationError implements Action {
  readonly type = LOAD_DATA_CUT_VALIDATION_ERROR;
}

export type Actions
  = LoadDataCutValidation
  | LoadDataCutValidationSuccess
  | LoadDataCutValidationError;
