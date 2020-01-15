import { Action } from '@ngrx/store';

import { DataViewField } from 'libs/models/payfactors-api';

import { FormulaFieldModalObj } from '../models';

export const VALIDATE_FORMULA = '[Data Insights / Formula Field Modal] Validate Formula';
export const VALIDATE_FORMULA_SUCCESS = '[Data Insights / Formula Field Modal] Validate Formula Success';
export const VALIDATE_FORMULA_ERROR = '[Data Insights / Formula Field Modal] Validate Formula Error';
export const SAVE_FORMULA_FIELD = '[Data Insights / Formula Field Modal] Save Formula Field';
export const CREATE_FORMULA_FIELD_SUCCESS = '[Data Insights / Formula Field Modal] Create Formula Field Success';
export const UPDATE_FORMULA_FIELD_SUCCESS = '[Data Insights / Formula Field Modal] Update Formula Field Success';
export const SAVE_FORMULA_FIELD_ERROR = '[Data Insights / Formula Field Modal] Save Formula Field Error';

export class ValidateFormula implements Action {
  readonly type = VALIDATE_FORMULA;

  constructor(public payload: { formula: string, baseEntityId: number }) {}
}

export class ValidateFormulaSuccess implements Action {
  readonly type = VALIDATE_FORMULA_SUCCESS;

  constructor(public payload: { result: boolean }) {}
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

export type Actions
  = ValidateFormula
  | ValidateFormulaSuccess
  | ValidateFormulaError
  | SaveFormulaField
  | CreateFormulaFieldSuccess
  | UpdateFormulaFieldSuccess
  | SaveFormulaFieldError;
