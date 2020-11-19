import { Action } from '@ngrx/store';

import { DataViewField } from 'libs/models/payfactors-api';
import { FormulaFieldModalObj } from 'libs/models/formula-editor';

import { Field, FieldDataType } from '../models';

export const WAIT_FOR_FORMULA_VALIDATION = '[Data Insights / Formula Field Modal] Wait For Formula Validation';
export const VALIDATE_FORMULA = '[Data Insights / Formula Field Modal] Validate Formula';
export const VALIDATE_FORMULA_SUCCESS = '[Data Insights / Formula Field Modal] Validate Formula Success';
export const VALIDATE_FORMULA_ERROR = '[Data Insights / Formula Field Modal] Validate Formula Error';
export const SAVE_FORMULA_FIELD = '[Data Insights / Formula Field Modal] Save Formula Field';
export const CREATE_FORMULA_FIELD_SUCCESS = '[Data Insights / Formula Field Modal] Create Formula Field Success';
export const UPDATE_FORMULA_FIELD_SUCCESS = '[Data Insights / Formula Field Modal] Update Formula Field Success';
export const SAVE_FORMULA_FIELD_ERROR = '[Data Insights / Formula Field Modal] Save Formula Field Error';
export const RESET_MODAL = '[Data Insights / Formula Field Modal] Reset Modal';
export const GET_FORMULA_FIELD_VIEW_COUNT = '[Data Insights / Formula Field Modal] Get Formula Field View Count';
export const GET_FORMULA_FIELD_VIEW_COUNT_SUCCESS = '[Data Insights / Formula Field Modal] Get Formula Field View Count Success';
export const GET_FORMULA_FIELD_VIEW_COUNT_ERROR = '[Data Insights / Formula Field Modal] Get Formula Field View Count Error';
export const DELETE_FORMULA_FIELD = '[Data Insights / Formula Field Modal] Delete Formula Field';
export const DELETE_FORMULA_FIELD_SUCCESS = '[Data Insights / Formula Field Modal] Delete Formula Field Success';
export const DELETE_FORMULA_FIELD_ERROR = '[Data Insights / Formula Field Modal] Delete Formula Field Error';
export const RESET_FORMULA = '[Data Insights / Formula Field Modal] Reset Formula';

export class WaitForFormulaValidation implements Action {
  readonly type = WAIT_FOR_FORMULA_VALIDATION;

  constructor() {}
}

export class ValidateFormula implements Action {
  readonly type = VALIDATE_FORMULA;

  constructor(public payload: { formula: string, baseEntityId: number }) {}
}

export class ValidateFormulaSuccess implements Action {
  readonly type = VALIDATE_FORMULA_SUCCESS;

  constructor(public payload: { result: boolean, dataType: FieldDataType }) {}
}

export class ValidateFormulaError implements Action {
  readonly type = VALIDATE_FORMULA_ERROR;

  constructor() {}
}

export class SaveFormulaField implements Action {
  readonly type = SAVE_FORMULA_FIELD;

  constructor(public payload: { formula: FormulaFieldModalObj, baseEntityId: number }) {}
}

export class CreateFormulaFieldSuccess implements Action {
  readonly type = CREATE_FORMULA_FIELD_SUCCESS;

  constructor(public payload: DataViewField) {}
}

export class UpdateFormulaFieldSuccess implements Action {
  readonly type = UPDATE_FORMULA_FIELD_SUCCESS;

  constructor(public payload: DataViewField) {}
}

export class SaveFormulaFieldError implements Action {
  readonly type = SAVE_FORMULA_FIELD_ERROR;

  constructor(public payload: { message: string }) {}
}

export class ResetModal implements Action {
  readonly type = RESET_MODAL;

  constructor() {}
}

export class DeleteFormulaField implements Action {
  readonly type = DELETE_FORMULA_FIELD;

  constructor(public payload: Field) {}
}

export class DeleteFormulaFieldSuccess implements Action {
  readonly type = DELETE_FORMULA_FIELD_SUCCESS;

  constructor(public payload: Field) {}
}

export class DeleteFormulaFieldError implements Action {
  readonly type = DELETE_FORMULA_FIELD_ERROR;

  constructor() {}
}

export class ResetFormula implements Action {
  readonly type = RESET_FORMULA;

  constructor() {}
}

export class GetFormulaFieldViewCount implements Action {
  readonly type = GET_FORMULA_FIELD_VIEW_COUNT;

  constructor(public payload: number) {}
}

export class GetFormulaFieldViewCountSuccess implements Action {
  readonly type = GET_FORMULA_FIELD_VIEW_COUNT_SUCCESS;

  constructor(public payload: number) {}
}

export class GetFormulaFieldViewCountError implements Action {
  readonly type = GET_FORMULA_FIELD_VIEW_COUNT_ERROR;

  constructor() {}
}

export type Actions
  = WaitForFormulaValidation
  | ValidateFormula
  | ValidateFormulaSuccess
  | ValidateFormulaError
  | SaveFormulaField
  | CreateFormulaFieldSuccess
  | UpdateFormulaFieldSuccess
  | SaveFormulaFieldError
  | ResetModal
  | DeleteFormulaField
  | DeleteFormulaFieldSuccess
  | DeleteFormulaFieldError
  | ResetFormula
  | GetFormulaFieldViewCount
  | GetFormulaFieldViewCountSuccess
  | GetFormulaFieldViewCountError;
