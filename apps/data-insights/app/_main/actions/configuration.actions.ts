import { Action } from '@ngrx/store';

import { Field, Filter, GetFilterOptionsData } from '../models';

export const ADD_FILTER = '[Data Insights / Configure] Add Filter';
export const UPDATE_FILTER_SELECTED_FIELD = '[Data Insights / Configure] Update Filter Selected Field';
export const UPDATE_FILTER_SELECTED_OPTIONS = '[Data Insights / Configure] Update Filter Selected Field Options';
export const REMOVE_PENDING_FILTER_BY_INDEX = '[Data Insights / Configure] Remove Pending Filter By Index';
export const REMOVE_ACTIVE_FILTER_BY_INDEX = '[Data Insights / Configure] Remove Active Filter By Index';
export const REMOVE_PENDING_FILTERS_BY_FIELD = '[Data Insights / Configure] Remove Pending Filters By Field';
export const REMOVE_ACTIVE_FILTERS_BY_FIELD = '[Data Insights / Configure] Remove Active Filters By Field';
export const GET_FILTER_OPTIONS = '[Data Insights / Configure] Get Filter Options';
export const GET_FILTER_OPTIONS_SUCCESS = '[Data Insights / Configure] Get Filter Options Success';
export const GET_FILTER_OPTIONS_ERROR = '[Data Insights / Configure] Get Filter Options Error';
export const SET_FILTERS = '[Data Insights / Configure] Set Filters';
export const APPLY_FILTERS = '[Data Insights / Configure] Apply Filters';
export const RESET_FILTERS = '[Data Insights / Configure] Reset Filters';
export const SAVE_FILTERS = '[Data Insights / Configure] Save Filters';
export const SAVE_FILTERS_SUCCESS = '[Data Insights / Configure] Save Filters Success';
export const SAVE_FILTERS_ERROR = '[Data Insights / Configure] Save Filters Error';

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

export class RemovePendingFilterByIndex implements Action {
  readonly type = REMOVE_PENDING_FILTER_BY_INDEX;

  constructor(public payload: { index: number }) {}
}

export class RemoveActiveFilterByIndex implements Action {
  readonly type = REMOVE_ACTIVE_FILTER_BY_INDEX;

  constructor(public payload: { index: number }) {}
}

export class RemovePendingFiltersByField implements Action {
  readonly type = REMOVE_PENDING_FILTERS_BY_FIELD;

  constructor(public payload: Field) {}
}

export class RemoveActiveFiltersByField implements Action {
  readonly type = REMOVE_ACTIVE_FILTERS_BY_FIELD;

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

  constructor() {}
}

export class ResetFilters implements Action {
  readonly type = RESET_FILTERS;

  constructor() {}
}

export class SaveFilters implements Action {
  readonly type = SAVE_FILTERS;

  constructor() {}
}

export class SaveFiltersSuccess implements Action {
  readonly type = SAVE_FILTERS_SUCCESS;

  constructor() {}
}

export class SaveFiltersError implements Action {
  readonly type = SAVE_FILTERS_ERROR;

  constructor() {}
}

export type Actions
  = AddFilter
  | UpdateFilterSelectedField
  | RemovePendingFilterByIndex
  | RemoveActiveFilterByIndex
  | RemovePendingFiltersByField
  | RemoveActiveFiltersByField
  | GetFilterOptions
  | GetFilterOptionsSuccess
  | GetFilterOptionsError
  | UpdateFilterSelectedOptions
  | SetFilters
  | ApplyFilters
  | ResetFilters
  | SaveFilters
  | SaveFiltersSuccess
  | SaveFiltersError;
