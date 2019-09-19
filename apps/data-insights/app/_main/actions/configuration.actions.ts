import { Action } from '@ngrx/store';

import { Field, Filter, GetFilterOptionsData } from '../models';

export const ADD_FILTER = '[Data Insights / Configure] Add Filter';
export const UPDATE_FILTER_SELECTED_FIELD = '[Data Insights / Configure] Update Filter Selected Field';
export const REMOVE_FILTER = '[Data Insights / Configure] Remove Filter';
export const GET_FILTER_OPTIONS = '[Data Insights / Configure] Get Filter Options';
export const GET_FILTER_OPTIONS_SUCCESS = '[Data Insights / Configure] Get Filter Options Success';
export const GET_FILTER_OPTIONS_ERROR = '[Data Insights / Configure] Get Filter Options Error';

export class AddFilter implements Action {
  readonly type = ADD_FILTER;

  constructor(public payload: Filter) {}
}

export class UpdateFilterSelectedField implements Action {
  readonly type = UPDATE_FILTER_SELECTED_FIELD;

  constructor(public payload: { index: number, field: Field }) {}
}

export class RemoveFilter implements Action {
  readonly type = REMOVE_FILTER;

  constructor(public payload: Field) {}
}

export class GetFilterOptions implements Action {
  readonly type = GET_FILTER_OPTIONS;

  constructor(public payload: GetFilterOptionsData) {}
}

export class GetFilterOptionsSuccess implements Action {
  readonly type = GET_FILTER_OPTIONS_SUCCESS;

  constructor(public payload: { index: number, options: string[] }) {}
}

export class GetFilterOptionsError implements Action {
  readonly type = GET_FILTER_OPTIONS_ERROR;

  constructor() {}
}

export type Actions
  = AddFilter
  | UpdateFilterSelectedField
  | RemoveFilter
  | GetFilterOptions
  | GetFilterOptionsSuccess
  | GetFilterOptionsError;
