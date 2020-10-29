import { Action } from '@ngrx/store';

import { Field } from '../models';

export const GET_AVAILABLE_REPORT_FIELDS_BY_PAGE_VIEW_ID = '[Data Insights / Data View Fields] Get Available Report Fields By PageViewId';
export const GET_AVAILABLE_REPORT_FIELDS = '[Data Insights / Data View Fields] Get Available Report Fields';
export const GET_AVAILABLE_REPORT_FIELDS_SUCCESS = '[Data Insights / Data View Fields] Get Available Report Fields Success';
export const GET_AVAILABLE_REPORT_FIELDS_ERROR = '[Data Insights / Data View Fields] Get Available Report Fields Error';
export const ADD_SELECTED_FIELD = '[Data Insights / Data View Fields] Add Selected Field';
export const REMOVE_SELECTED_FIELD = '[Data Insights / Data View Fields] Remove Selected Field';
export const SAVE_REPORT_FIELDS = '[Data Insights / Data View Fields] Save Report Fields';
export const SAVE_REPORT_FIELDS_SUCCESS = '[Data Insights / Data View Fields] Save Report Fields Success';
export const SAVE_REPORT_FIELDS_ERROR = '[Data Insights / Data View Fields] Save Report Fields Error';
export const REORDER_FIELDS = '[Data Insights / Data View Fields] Reorder Fields';
export const SET_SELECTED_FIELDS = '[Data Insights / Data View Fields] Set Selected Fields';
export const UPDATE_DISPLAY_NAME = '[Data Insights / Data View Fields] Update Display Name';
export const ADD_NEW_FORMULA_FIELD = '[Data Insights / Data View Fields] Add New Formula Field';
export const SET_FORMAT_ON_SELECTED_FIELD = '[Data Insights / Data View Fields] Set Format On Selected Field';
export const SAVE_UPDATED_FORMULA_FIELD = '[Data Insights / Data View Fields] Save Updated Formula Field';
export const REMOVE_FORMULA_FIELD = '[Data Insights / Data View Fields] Remove Formula Field';
export const SORT_FIELD = '[Data Insights / Data View Fields] Sort Field';
export const CLEAR_FORMATING = '[Data Insights / Data View Fields] Clear Formating';

export class GetAvailableReportFieldsByPageViewId implements Action {
  readonly type = GET_AVAILABLE_REPORT_FIELDS_BY_PAGE_VIEW_ID;

  constructor(public payload: { pageViewId: string }) {}
}

export class GetAvailableReportFields implements Action {
  readonly type = GET_AVAILABLE_REPORT_FIELDS;

  constructor(public payload: { dataViewId: number }) {}
}

export class GetAvailableReportFieldsSuccess implements Action {
  readonly type = GET_AVAILABLE_REPORT_FIELDS_SUCCESS;

  constructor(public payload: Field[]) {}
}

export class GetAvailableReportFieldsError implements Action {
  readonly type = GET_AVAILABLE_REPORT_FIELDS_ERROR;

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

export  class SetFormatOnSelectedField implements Action {
  readonly type = SET_FORMAT_ON_SELECTED_FIELD;

  constructor(public payload: Field) {}
}

export class SaveUpdatedFormulaField implements Action {
  readonly type = SAVE_UPDATED_FORMULA_FIELD;

  constructor(public payload: Field) {}
}

export class RemoveFormulaField implements Action {
  readonly type = REMOVE_FORMULA_FIELD;

  constructor(public payload: Field) {}
}

export class SortField implements Action {
  readonly type = SORT_FIELD;

  constructor(public payload: { field: Field, sortDirection: 'asc' | 'desc' }) {}
}

export class ClearFormating implements Action {
  readonly type = CLEAR_FORMATING;

  constructor(public payload: Field) {}
}

export type Actions
  = GetAvailableReportFieldsByPageViewId
  | GetAvailableReportFields
  | GetAvailableReportFieldsSuccess
  | GetAvailableReportFieldsError
  | RemoveSelectedField
  | SaveReportFields
  | SaveReportFieldsSuccess
  | SaveReportFieldsError
  | ReorderFields
  | AddSelectedField
  | SetSelectedFields
  | UpdateDisplayName
  | AddNewFormulaField
  | SetFormatOnSelectedField
  | SaveUpdatedFormulaField
  | RemoveFormulaField
  | SortField
  | ClearFormating;
