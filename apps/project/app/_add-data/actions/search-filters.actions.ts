import { Action } from '@ngrx/store';

import { SearchFilter } from 'libs/models/survey-search';

import { Filter } from '../models';

export const CLEAR_FILTERS = '[Project Add Data/Search Filters] Clear Filters';
export const UPDATE_FILTER_VALUE = '[Project Add Data/Search Filters] Update Value';
export const GET_DEFAULT_SURVEY_SCOPES_FILTER = '[Project Add Data/Add Survey Data Page] Get Default Survey Scopes Filter';
export const GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS = '[Project Add Data/Add Survey Data Page] Get Default Survey Scopes Filter Success';
export const TOGGLE_MULTI_SELECT_OPTION = '[Project Add Data/Search Filters] Toggle Multi Select Option';
export const REFRESH_FILTERS = '[Project Add Data/Search Filters] Refresh Filters';
export const RESET_FILTER = '[Project Add Data/Search Filters] Reset Filter';
export const RESET_ALL_FILTERS = '[Project Add Data/Search Filters] Reset All Filters';

export class ClearFilters implements Action {
  readonly type = CLEAR_FILTERS;
}

export class UpdateFilterValue implements Action {
  readonly type = UPDATE_FILTER_VALUE;

  constructor(public payload: any) {}
}

export class GetDefaultScopesFilter implements Action {
  readonly type = GET_DEFAULT_SURVEY_SCOPES_FILTER;
}

export class GetDefaultScopesFilterSuccess implements Action {
  readonly type = GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS;

  constructor(public payload: SearchFilter) {}
}

export class ToggleMultiSelectOption implements Action {
  readonly type = TOGGLE_MULTI_SELECT_OPTION;

  constructor(public payload: any) {}
}

export class RefreshFilters implements Action {
  readonly type = REFRESH_FILTERS;

  constructor(public payload: { searchFilters: Filter[], keepFilteredOutOptions: boolean }) {}
}

export class ResetFilter implements Action {
  readonly type = RESET_FILTER;

  constructor(public payload: string) {}
}

export class ResetAllFilters implements Action {
  readonly type = RESET_ALL_FILTERS;

  constructor() {}
}

export type Actions
  = ClearFilters
  | UpdateFilterValue
  | GetDefaultScopesFilter
  | GetDefaultScopesFilterSuccess
  | ToggleMultiSelectOption
  | RefreshFilters
  | ResetFilter
  | ResetAllFilters;
