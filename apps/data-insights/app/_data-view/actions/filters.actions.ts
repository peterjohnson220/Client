import { Action } from '@ngrx/store';

import { Field, Filter, GetFilterOptionsData } from 'libs/features/formula-editor';

export const ADD_FILTER = '[Data Insights / Data View Filters] Add Filter';
export const UPDATE_FILTER = '[Data Insights / Data View Filters] Update Filter ';
export const REMOVE_PENDING_FILTER_BY_INDEX = '[Data Insights / Data View Filters] Remove Pending Filter By Index';
export const REMOVE_ACTIVE_FILTER_BY_INDEX = '[Data Insights / Data View Filters] Remove Active Filter By Index';
export const REMOVE_PENDING_FILTERS_BY_FIELD = '[Data Insights / Data View Filters] Remove Pending Filters By Field';
export const REMOVE_ACTIVE_FILTERS_BY_FIELD = '[Data Insights / Data View Filters] Remove Active Filters By Field';
export const GET_FILTER_OPTIONS = '[Data Insights / Data View Filters] Get Filter Options';
export const GET_FILTER_OPTIONS_SUCCESS = '[Data Insights / Data View Filters] Get Filter Options Success';
export const GET_FILTER_OPTIONS_ERROR = '[Data Insights / Data View Filters] Get Filter Options Error';
export const SET_FILTERS = '[Data Insights / Data View Filters] Set Filters';
export const APPLY_FILTERS = '[Data Insights / Data View Filters] Apply Filters';
export const RESET_FILTERS = '[Data Insights / Data View Filters] Reset Filters';
export const SAVE_FILTERS = '[Data Insights / Data View Filters] Save Filters';
export const SAVE_FILTERS_SUCCESS = '[Data Insights / Data View Filters] Save Filters Success';
export const SAVE_FILTERS_ERROR = '[Data Insights / Data View Filters] Save Filters Error';
export const UPDATE_FILTER_FORMAT = '[Data Insights / Data View Filters] Update Filter Format';

export class AddFilter implements Action {
  readonly type = ADD_FILTER;

  constructor(public payload: Filter) {}
}

export class UpdateFilter implements Action {
  readonly type = UPDATE_FILTER;

  constructor(public payload: { index: number, filter: Filter }) {}
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

export class UpdateFilterFormat implements Action {
  readonly type = UPDATE_FILTER_FORMAT;

  constructor(public payload: Field) {}
}

export type Actions
  = AddFilter
  | UpdateFilter
  | RemovePendingFilterByIndex
  | RemoveActiveFilterByIndex
  | RemovePendingFiltersByField
  | RemoveActiveFiltersByField
  | GetFilterOptions
  | GetFilterOptionsSuccess
  | GetFilterOptionsError
  | SetFilters
  | ApplyFilters
  | ResetFilters
  | SaveFilters
  | SaveFiltersSuccess
  | SaveFiltersError
  | UpdateFilterFormat;
