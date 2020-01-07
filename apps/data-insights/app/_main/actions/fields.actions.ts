import { Action } from '@ngrx/store';

import { Field } from '../models';

export const GET_REPORT_FIELDS = '[Data Insights / Data View Fields] Get Report Fields';
export const GET_REPORT_FIELDS_SUCCESS = '[Data Insights / Data View Fields] Get Report Fields Success';
export const GET_REPORT_FIELDS_ERROR = '[Data Insights / Data View Fields] Get Report Fields Error';
export const ADD_SELECTED_FIELD = '[Data Insights / Data View Fields] Add Selected Field';
export const REMOVE_SELECTED_FIELD = '[Data Insights / Data View Fields] Remove Selected Field';
export const SAVE_REPORT_FIELDS = '[Data Insights / Data View Fields] Save Report Fields';
export const SAVE_REPORT_FIELDS_SUCCESS = '[Data Insights / Data View Fields] Save Report Fields Success';
export const SAVE_REPORT_FIELDS_ERROR = '[Data Insights / Data View Fields] Save Report Fields Error';
export const REORDER_FIELDS = '[Data Insights / Data View Fields] Reorder Fields';
export const SET_SELECTED_FIELDS = '[Data Insights / Data View Fields] Set Selected Fields';
export const UPDATE_DISPLAY_NAME = '[Data Insights / Data View Fields] Update Display Name';
export const ADD_NEW_FORMULA_FIELD = '[Data Insights / Data View Fields] Add New Formula Field';

export class GetReportFields implements Action {
  readonly type = GET_REPORT_FIELDS;

  constructor(public payload: { dataViewId: number }) {}
}

export class GetReportFieldsSuccess implements Action {
  readonly type = GET_REPORT_FIELDS_SUCCESS;

  constructor(public payload: Field[]) {}
}

export class GetReportFieldsError implements Action {
  readonly type = GET_REPORT_FIELDS_ERROR;

  constructor() {}
}

export class RemoveSelectedField implements Action {
  readonly type = REMOVE_SELECTED_FIELD;

  constructor(public payload: Field) {}
}

export class SaveReportFields implements Action {
  readonly type = SAVE_REPORT_FIELDS;

  constructor() {}
}

export class SaveReportFieldsSuccess implements Action {
  readonly type = SAVE_REPORT_FIELDS_SUCCESS;

  constructor() {}
}

export class SaveReportFieldsError implements Action {
  readonly type = SAVE_REPORT_FIELDS_ERROR;

  constructor() {}
}

export class ReorderFields implements Action {
  readonly type = REORDER_FIELDS;

  constructor(public payload: Field[]) {}
}

export class AddSelectedField implements Action {
  readonly type = ADD_SELECTED_FIELD;

  constructor(public payload: Field) {}
}

export class SetSelectedFields implements Action {
  readonly type = SET_SELECTED_FIELDS;

  constructor(public payload: Field[]) {}
}

export  class UpdateDisplayName implements Action {
  readonly type = UPDATE_DISPLAY_NAME;

  constructor(public payload: { field: Field, displayName: string }) {}
}

export class AddNewFormulaField implements Action {
  readonly type = ADD_NEW_FORMULA_FIELD;

  constructor(public payload: Field) {}
}

export type Actions
  = GetReportFields
  | GetReportFieldsSuccess
  | GetReportFieldsError
  | RemoveSelectedField
  | SaveReportFields
  | SaveReportFieldsSuccess
  | SaveReportFieldsError
  | ReorderFields
  | AddSelectedField
  | SetSelectedFields
  | UpdateDisplayName
  | AddNewFormulaField;
