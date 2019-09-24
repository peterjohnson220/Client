import { Action } from '@ngrx/store';

import { Field, Filter, GetFilterOptionsData } from '../models';

export const ADD_FILTER = '[Data Insights / Configure] Add Filter';
export const UPDATE_FILTER_SELECTED_FIELD = '[Data Insights / Configure] Update Filter Selected Field';
export const UPDATE_FILTER_SELECTED_OPTIONS = '[Data Insights / Configure] Update Filter Selected Field Options';
export const REMOVE_FILTER = '[Data Insights / Configure] Remove Filter';
export const GET_FILTER_OPTIONS = '[Data Insights / Configure] Get Filter Options';
export const GET_FILTER_OPTIONS_SUCCESS = '[Data Insights / Configure] Get Filter Options Success';
export const GET_FILTER_OPTIONS_ERROR = '[Data Insights / Configure] Get Filter Options Error';
export const SET_FILTERS = '[Data Insights / Configure] Set Filters';
export const APPLY_FILTERS = '[Data Insights / Configure] Apply Filters';
export const RESET_FILTERS = '[Data Insights / Configure] Reset Filters';

export class AddFilter implements Action {
  readonly type = ADD_FILTER;

  constructor(public payload: Filter) {}
}

export class UpdateFilterSelectedField implements Action {
  readonly type = UPDATE_FILTER_SELECTED_FIELD;

  constructor(public payload: { index: number, field: Field }) {}
}

export class UpdateFilterSelectedOptions implements Action {
  readonly type = UPDATE_FILTER_SELECTED_OPTIONS;

  constructor(public payload: { index: number, selectedOptions: string[] }) {}
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

export class SetFilters implements Action {
  readonly type = SET_FILTERS;

  constructor(public payload: Filter[]) {}
}

export class ApplyFilters implements Action {
  readonly type = APPLY_FILTERS;

  constructor(public payload: Filter[]) {}
}

export class ResetFilters implements Action {
  readonly type = RESET_FILTERS;

  constructor() {}
}

export type Actions
  = AddFilter
  | UpdateFilterSelectedField
  | RemoveFilter
  | GetFilterOptions
  | GetFilterOptionsSuccess
  | GetFilterOptionsError
  | UpdateFilterSelectedOptions
  | SetFilters
  | ApplyFilters
  | ResetFilters;
